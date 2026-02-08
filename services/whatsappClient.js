import { default as makeWASocket, DisconnectReason, Browsers, useMultiFileAuthState } from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";
import { existsSync, mkdirSync, rmSync, readFileSync } from "fs";
import { join } from "path";
import { commands } from "../commands/index.js";
import { getCachedConfig, updateConfig, invalidateConfigCache, AUTH_INFO_PATH } from "./configService.js";
import { getRepoStats as getCachedRepoStats } from "../utils/githubStats.js";

export const messageCache = new Map();

// Memoized logo for efficiency
let logoBuffer = null;
try {
    logoBuffer = readFileSync(join(process.cwd(), "assets", "tervux-logo.png"));
} catch (e) {
    console.error("❌ Failed to load logo buffer:", e.message);
}

// Memory monitoring
setInterval(() => {
    const memory = process.memoryUsage();
    const rssMB = (memory.rss / 1024 / 1024).toFixed(1);
    const heapUsedMB = (memory.heapUsed / 1024 / 1024).toFixed(1);
    console.log(`📊 [Memory] RSS: ${rssMB}MB | Heap: ${heapUsedMB}MB`);

    if (memory.rss > 420 * 1024 * 1024 && global.gc) {
        console.warn(`🧹 CRITICAL: Memory RSS high. Triggering Manual GC...`);
        global.gc();
    }
}, 30000);

// Single client instance (single-user bot)
let activeClient = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

export async function createWhatsAppClient() {
    const config = getCachedConfig();
    // Use Baileys built-in file-based auth
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_INFO_PATH);

    console.log(`🔌 Creating WhatsApp socket...`);

    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        auth: state,
        browser: Browsers.ubuntu("Chrome"),
        syncFullHistory: false,
        shouldSyncHistoryMessage: () => false,
        connectTimeoutMs: 180000, // 3 minutes for slow networks
        defaultQueryTimeoutMs: 180000,
        keepAliveIntervalMs: 25000,
        retryRequestDelayMs: 3000,
        qrTimeout: 60000,
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: false,
        getMessage: async (key) => {
            const msg = messageCache.get(key.id);
            return msg?.message;
        }
    });

    sock.ev.on("creds.update", async () => {
        console.log(`💾 Credentials updated. Saving...`);
        await saveCreds();
    });

    // Pairing Code Logic - only run if phone is set AND we don't have valid credentials
    const hasValidSession = state.creds?.registered || state.creds?.me?.id;
    if (config.phone && !hasValidSession) {
        console.log(`\n📱 Phone number detected: ${config.phone}`);
        console.log(`🔄 Switching to Pairing Code mode...`);
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(config.phone.replace(/[^0-9]/g, ''));
                console.log(`\n📞 𝗣𝗔𝗜𝗥𝗜𝗡𝗚 𝗖𝗢𝗗𝗘: ${code}`);
                console.log(`👉 Enter this code on WhatsApp > Linked Devices > Link a Device > Link with phone number instead\n`);
            } catch (e) {
                console.error("❌ Failed to request pairing code:", e.message);
            }
        }, 5000);
    }

    sock.ev.on("connection.update", async (update) => {

        const { connection, lastDisconnect, qr } = update;

        if (qr && !config.phone) {
            console.log(`\n📱 Scan this QR code with WhatsApp to connect:`);
            console.log(`(If the QR is broken/too big, set the 'PHONE' environment variable to use Pairing Code instead!)\n`);
            try {
                qrcode.generate(qr, { small: true });
            } catch (e) {
                console.log(`QR Code Generation Failed. Raw QR: ${qr}`);
            }
        }

        if (connection === "connecting") {
            console.log(`🔌 Connecting to WhatsApp...`);
        }

        if (connection === "close") {
            if (sock.onlineInterval) clearInterval(sock.onlineInterval);

            const error = lastDisconnect?.error;
            const statusCode = error?.output?.statusCode;
            const errorMessage = error?.message || "";

            const isLoggedOut = statusCode === DisconnectReason.loggedOut;
            const isConflict = errorMessage.includes("conflict") ||
                statusCode === DisconnectReason.connectionReplaced;

            console.log(`❌ Connection closed. Code: ${statusCode}, Error: ${errorMessage}`);

            if (isLoggedOut) {
                console.log(`🔓 Logged out! Clearing session...`);
                try {
                    rmSync(AUTH_INFO_PATH, { recursive: true, force: true });
                    mkdirSync(AUTH_INFO_PATH, { recursive: true });
                } catch (e) {
                    console.error("Failed to clear auth:", e);
                }
                console.log(`📱 Please restart the bot and scan QR code again.`);
                reconnectAttempts = MAX_RECONNECT_ATTEMPTS; // Stop reconnection
            } else if (isConflict) {
                console.log(`⚠️ Session active on another device.`);
            } else if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                reconnectAttempts++;
                const delay = Math.min(5000 * Math.pow(1.5, reconnectAttempts), 60000);
                console.log(`🔄 Reconnecting in ${delay / 1000}s (Attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
                setTimeout(() => {
                    createWhatsAppClient().then(client => {
                        activeClient = client;
                    });
                }, delay);
            } else {
                console.log(`❌ Max reconnection attempts reached. Please restart manually.`);
            }
        }

        if (connection === "open") {
            console.log(`✅ WhatsApp connected successfully!`);
            reconnectAttempts = 0;

            // Update config with phone number
            const phoneNumber = sock.user?.id?.split(":")[0] || sock.user?.id?.split("@")[0];
            if (phoneNumber) {
                updateConfig({ phone: phoneNumber, name: sock.user?.name || "Bot User" });
                invalidateConfigCache();
            }

            // Send welcome message on first connect
            try {
                const config = getCachedConfig();
                const botJid = (sock.user.id.split("@")[0].split(":")[0]) + "@s.whatsapp.net";

                const stats = await getCachedRepoStats(); // Helper we need to import or reuse 

                const githubSection = stats ?
                    `╭───『 📊 *𝔾𝕀𝕋ℍ𝕌𝔹 𝕊𝕋𝔸𝕋𝕊* 』───╮
│ ⭐ *Stars:* ${stats.stars}
│ 🍴 *Forks:* ${stats.forks}
│ 🐞 *Issues:* ${stats.issues}
│ 📅 *Created:* ${stats.createdAt}
│ 🔄 *Updated:* ${stats.updatedAt}
╰──────────────────────────────╯` : "";

                const welcomeMsg = `╔══════════════════════════════════╗
║  🤖 *𝕋𝔼ℝ𝕍𝕌𝕏 𝔹𝕆𝕋 ℂ𝕆ℕℕ𝔼ℂ𝕋𝔼𝔻* 🤖  ║
╚══════════════════════════════════╝

✨ *Welcome!* Your personal WhatsApp assistant is now online and ready to serve you! ✨

${githubSection}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 *𝔽𝕌ℕ ℤ𝕆ℕ𝔼*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• *!ship* - Love calculator 💕
• *!fancy* - Fancy fonts generator ✨
• *!joke* - Random jokes 😂
• *!fact* - Fun facts 🧠
• *!truth* / *!dare* - Game time 🔥

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 *𝔾ℝ𝕆𝕌ℙ 𝕄𝔸ℕ𝔸𝔾𝔼𝕄𝔼ℕ𝕋*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• *!kick* / *!add* - Manage members 👥
• *!promote* / *!demote* - Manage admins 👑
• *!hidetag* / *!tagall* - Tag members 📢
• *!welcome* / *!goodbye* - Auto-messages 👋
• *!antilink* - Link protection 🛡️
• *!poll* / *!warn* - Moderation tools 📊

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ *𝔾𝔼ℕ𝔼ℝ𝔸𝕃*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• *!help* - Show all commands 📚
• *!ping* - Check latency ⚡
• *!botstats* - System stats 📊
• *!owner* - Owner info 👤
• *!block* / *!unblock* - User management 🚫

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 *𝕄𝔼𝔻𝕀𝔸*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• *!movie* - Movie search 🎥
• *!sport* - Team info ⚽
• *!news* - World news 📰
• *!play* - Play music 🎵
• *!video* - Download video 📹

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ *𝕋𝕆𝕆𝕃𝕊*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• *!calc* - Calculator 🧮
• *!qr* - QR generator 📱
• *!weather* - Weather forecast 🌤️
• *!translate* - Translator 🌍

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ *𝕊𝔼𝕋𝕋𝕀ℕ𝔾𝕊*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• *!settings* - View configuration 🔧
• *!alwaysonline* - 24/7 Online 🌐
• *!antidelete* - Anti-delete info 🛡️
• *!anticall* - Anti-call info 📵
• *!autoread* - Auto-read info ✔️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 *Quick Start:* Type *!help* for more details

╔══════════════════════════════════╗
║    💠 *ℙ𝕠𝕨𝕖𝕣𝕖𝕕 𝕓𝕪 𝕋𝔼ℝ𝕍𝕌𝕏* 💠    ║
╚══════════════════════════════════╝

🔗 github.com/JonniTech/Tervux-WhatsApp-Bot`;

                // Send with logo if available
                if (logoBuffer) {
                    await sock.sendMessage(botJid, {
                        image: logoBuffer,
                        caption: welcomeMsg
                    });
                } else {
                    await sock.sendMessage(botJid, { text: welcomeMsg });
                }
                console.log(`📬 Welcome message sent!`);
            } catch (e) {
                console.error("Failed to send welcome:", e.message);
            }

            // Always Online heartbeat
            if (sock.onlineInterval) clearInterval(sock.onlineInterval);
            sock.onlineInterval = setInterval(async () => {
                const config = getCachedConfig();
                if (config.alwaysOnline && sock.ws?.readyState === 1) {
                    try {
                        await sock.sendPresenceUpdate("available");
                    } catch (e) { }
                }
            }, 30000);
        }
    });

    // Anti-Call Logic
    sock.ev.on("call", async (node) => {
        const config = getCachedConfig();
        if (config.antiCall) {
            for (const call of node) {
                if (call.status === "offer") {
                    try {
                        await sock.rejectCall(call.id, call.from);
                        await sock.sendMessage(call.from, {
                            text: "📵 *Tervux Bot*\n\nCalls are automatically rejected. Please send a text message instead."
                        });
                        console.log(`📵 Rejected call from ${call.from}`);
                    } catch (err) {
                        console.error("Anti-Call error:", err.message);
                    }
                }
            }
        }
    });

    // Status Auto-Actions
    sock.ev.on("messages.upsert", async ({ messages }) => {
        for (const m of messages) {
            // Status handling
            if (m.key.remoteJid === "status@broadcast" && !m.key.fromMe) {
                if (m.message?.protocolMessage || m.message?.reactionMessage) continue;

                const config = getCachedConfig();
                const participant = m.key.participant || m.participant;

                try {
                    if (config.autoViewStatus) {
                        await sock.readMessages([m.key]);
                    }

                    if (config.autoLikeStatus) {
                        const emojis = ["🦁", "🐯", "🦒", "🐘", "🦅", "🌲", "🌴", "⭐", "🌈", "🔥"];
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        await sock.sendMessage(m.key.remoteJid, {
                            react: { text: randomEmoji, key: m.key }
                        }, { statusJidList: [participant] });
                    }
                } catch (err) {
                    console.error("Status Auto-Action Error:", err.message);
                }
            }
        }
    });

    // Anti-Delete Cache - store messages for later restoration
    sock.ev.on("messages.upsert", async ({ messages }) => {
        for (const m of messages) {
            if (!m.message) continue;

            // Skip protocol messages (delete notifications, read receipts, etc.)
            if (m.message.protocolMessage) continue;
            if (m.message.reactionMessage) continue;
            if (m.message.pollUpdateMessage) continue;

            // Get the actual message content type
            const msgType = Object.keys(m.message)[0];

            // Only cache messages with actual content
            const validTypes = [
                'conversation', 'extendedTextMessage', 'imageMessage',
                'videoMessage', 'audioMessage', 'documentMessage',
                'stickerMessage', 'contactMessage', 'locationMessage',
                'viewOnceMessage', 'viewOnceMessageV2', 'ephemeralMessage'
            ];

            if (validTypes.includes(msgType)) {
                messageCache.set(m.key.id, m);
                console.log(`📦 [Cache] Stored message ${m.key.id.substring(0, 10)}... type: ${msgType}`);
            }

            // Limit cache size
            if (messageCache.size > 500) {
                const firstKey = messageCache.keys().next().value;
                messageCache.delete(firstKey);
            }
        }
    });

    // Helper function to restore deleted messages
    async function restoreDeletedMessage(sock, originalMsg, deletedId) {
        try {
            const sender = originalMsg.key.participant || originalMsg.key.remoteJid;
            const senderName = sender.split("@")[0];
            const timestamp = new Date().toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });

            let msgContent = originalMsg.message;
            console.log(`🔍 [AntiDelete] Original message keys:`, Object.keys(msgContent || {}));

            // Unwrap viewOnce containers
            if (msgContent?.viewOnceMessage) msgContent = msgContent.viewOnceMessage.message;
            if (msgContent?.viewOnceMessageV2) msgContent = msgContent.viewOnceMessageV2.message;
            if (msgContent?.viewOnceMessageV2Extension) msgContent = msgContent.viewOnceMessageV2Extension.message;
            if (msgContent?.ephemeralMessage) msgContent = msgContent.ephemeralMessage.message;

            const type = Object.keys(msgContent || {})[0];
            console.log(`🔍 [AntiDelete] Message type: ${type}`);

            // Extract text based on message type
            let text = "";
            let msgTypeDisplay = "📝 Text";

            if (type === "conversation") {
                text = msgContent.conversation || "";
            } else if (type === "extendedTextMessage") {
                text = msgContent.extendedTextMessage?.text || "";
            } else if (type === "imageMessage") {
                text = msgContent.imageMessage?.caption || "[No Caption]";
                msgTypeDisplay = "🖼️ Image";
            } else if (type === "videoMessage") {
                text = msgContent.videoMessage?.caption || "[No Caption]";
                msgTypeDisplay = "🎬 Video";
            } else if (type === "documentMessage") {
                text = msgContent.documentMessage?.fileName || "[Unknown File]";
                msgTypeDisplay = "📄 Document";
            } else if (type === "audioMessage") {
                text = "[Voice Message]";
                msgTypeDisplay = "🎤 Voice";
            } else if (type === "stickerMessage") {
                text = "[Sticker]";
                msgTypeDisplay = "🎭 Sticker";
            } else if (type === "contactMessage") {
                text = msgContent.contactMessage?.displayName || "Unknown";
                msgTypeDisplay = "👤 Contact";
            } else if (type === "locationMessage") {
                text = "[Location Shared]";
                msgTypeDisplay = "📍 Location";
            } else {
                text = `[${type || "Unknown"} message]`;
                msgTypeDisplay = "❓ Unknown";
            }

            console.log(`🔍 [AntiDelete] Extracted text: "${text}"`);

            const output = `╔══════════════════════════════════╗
║ 🛡️ *𝕋𝔼ℝ𝕍𝕌𝕏 𝔸ℕ𝕋𝕀-𝔻𝔼𝕃𝔼𝕋𝔼* 🛡️   ║
╠══════════════════════════════════╣
║  _𝕊𝕠𝕞𝕖𝕠𝕟𝕖 𝕥𝕣𝕚𝕖𝕕 𝕥𝕠 𝕙𝕚𝕕𝕖 𝕥𝕙𝕚𝕤!_   ║
╚══════════════════════════════════╝

👤 *𝕊𝕖𝕟𝕕𝕖𝕣:* @${senderName}
⏰ *ℝ𝕖𝕔𝕠𝕧𝕖𝕣𝕖𝕕:* ${timestamp}
📂 *𝕋𝕪𝕡𝕖:* ${msgTypeDisplay}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📨 *𝔻𝔼𝕃𝔼𝕋𝔼𝔻 𝕄𝔼𝕊𝕊𝔸𝔾𝔼:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${text}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     💠 *ℙ𝕠𝕨𝕖𝕣𝕖𝕕 𝕓𝕪 𝕋𝔼ℝ𝕍𝕌𝕏 𝔹𝕠𝕥* 💠
🔗 github.com/JonniTech/Tervux-WhatsApp-Bot`;

            await sock.sendMessage(originalMsg.key.remoteJid, {
                text: output,
                mentions: [sender]
            });
            console.log(`🛡️ Restored deleted message: ${deletedId}`);
        } catch (err) {
            console.error("Anti-Delete Error:", err.message);
        }
    }

    // Anti-Delete Restoration
    sock.ev.on("messages.update", async (updates) => {
        const config = getCachedConfig();
        if (!config.antiDelete) return;

        for (const update of updates) {
            // Method 1: Detect deletion via messageStubType: 1 (Baileys v7 pattern)
            if (update.update?.messageStubType === 1 && update.update?.message === null) {
                // Try multiple ID sources
                const possibleIds = [
                    update.update?.key?.id,
                    update.key?.id,
                    update.update?.messageStubParameters?.[0]
                ].filter(Boolean);

                console.log(`🔍 [AntiDelete] Possible deleted IDs:`, possibleIds);
                console.log(`📦 [AntiDelete] Cache contains:`, [...messageCache.keys()].slice(-5)); // Last 5 cached

                let found = false;
                for (const deletedId of possibleIds) {
                    const originalMsg = messageCache.get(deletedId);
                    if (originalMsg) {
                        await restoreDeletedMessage(sock, originalMsg, deletedId);
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    console.log(`⚠️ [AntiDelete] Message not found in cache. Tried IDs:`, possibleIds);
                }
                continue;
            }

            // Method 2: Detect via protocolMessage (older Baileys pattern)
            const protocolMsg = update.update?.protocolMessage ||
                update.update?.message?.protocolMessage ||
                update.message?.protocolMessage;

            if (protocolMsg && (protocolMsg.type === 0 || protocolMsg.type === 5 || protocolMsg.type === "REVOKE")) {
                const deletedId = protocolMsg.key?.id;
                console.log(`🔍 [AntiDelete] Detected deletion via protocolMessage, ID: ${deletedId}`);

                const originalMsg = messageCache.get(deletedId);
                if (originalMsg) {
                    await restoreDeletedMessage(sock, originalMsg, deletedId);
                } else {
                    console.log(`⚠️ [AntiDelete] Message not in cache: ${deletedId}`);
                }
            }
        }
    });

    // Command Handler
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        if (type !== "notify") return;

        for (const m of messages) {
            if (!m.message) continue;

            const messageText = m.message.conversation ||
                m.message.extendedTextMessage?.text ||
                m.message.imageMessage?.caption ||
                m.message.videoMessage?.caption || "";

            const config = getCachedConfig();
            const prefix = config.prefix || "!";

            if (!messageText.startsWith(prefix)) continue;

            // Only allow bot owner to use commands
            const senderJid = m.key.participant || m.key.remoteJid;
            const botJid = (sock.user?.id?.split("@")[0]?.split(":")[0]) + "@s.whatsapp.net";

            if (!m.key.fromMe && senderJid !== botJid) {
                const accessDeniedMsg = `╔══════════════════════════════════╗
║  🚫 *𝔸ℂℂ𝔼𝕊𝕊 𝔻𝔼ℕ𝕀𝔼𝔻* 🚫  ║
╚══════════════════════════════════╝

⚠️ *𝕆𝕠𝕡𝕤!* This is a private Tervux Bot instance.
Only the owner can execute commands here.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ *𝔾𝔼𝕋 𝕐𝕆𝕌ℝ 𝕆𝕎ℕ 𝔹𝕆𝕋 (𝔽ℝ𝔼𝔼!)*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deploy your own Tervux Bot in minutes!

📋 *𝕊𝕚𝕞𝕡𝕝𝕖 𝕊𝕥𝕖𝕡𝕤:*
• *Step 1:* Go to GitHub and Fork the repo
• *Step 2:* Deploy to Railway or Render (free)
• *Step 3:* Set your PHONE number as env variable
• *Step 4:* Enter Pairing Code on WhatsApp
• *Step 5:* Done! Your bot is live 🎉

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 *ℝ𝕖𝕡𝕠𝕤𝕚𝕥𝕠𝕣𝕪:*
github.com/JonniTech/Tervux-WhatsApp-Bot
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

╔══════════════════════════════════╗
║    💠 *ℙ𝕠𝕨𝕖𝕣𝕖𝕕 𝕓𝕪 𝕋𝔼ℝ𝕍𝕌𝕏* 💠    ║
╚══════════════════════════════════╝`;

                await sock.sendMessage(m.key.remoteJid, {
                    text: accessDeniedMsg
                }, { quoted: m });
                continue;
            }

            // Parse command
            const args = messageText.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            if (commands[commandName]) {
                try {
                    console.log(`⚡ Executing command: ${commandName}`);
                    const result = await commands[commandName](sock, m, args);

                    if (result) {
                        const footer = `\n\n━━━━━━━━━━━━━━━━━━━━\n💠 *ℙ𝕠𝕨𝕖𝕣𝕖𝕕 𝕓𝕪 𝕋𝔼ℝ𝕍𝕌𝕏 𝔹𝕠𝕥*\n🔗 github.com/JonniTech/Tervux-WhatsApp-Bot`;

                        if (typeof result === "string") {
                            await sock.sendMessage(m.key.remoteJid, { text: result + footer });
                        } else if (typeof result === "object") {
                            if (result.caption) result.caption += footer;
                            else if (result.text) result.text += footer;
                            await sock.sendMessage(m.key.remoteJid, result);
                        }
                    }
                } catch (err) {
                    console.error(`❌ Command error (${commandName}):`, err.message);
                    await sock.sendMessage(m.key.remoteJid, {
                        text: `❌ Error executing command: ${err.message}`
                    });
                }
            }

            // Auto-read
            if (config.autoReadMessages && !m.key.fromMe) {
                sock.readMessages([m.key]).catch(() => { });
            }

            // Typing/Recording presence
            if (config.alwaysTyping && !m.key.fromMe) {
                sock.sendPresenceUpdate("composing", m.key.remoteJid).catch(() => { });
            } else if (config.alwaysRecording && !m.key.fromMe) {
                sock.sendPresenceUpdate("recording", m.key.remoteJid).catch(() => { });
            }
        }
    });

    activeClient = sock;
    return sock;
}

export function getClient() {
    return activeClient;
}

export function clearSession() {
    try {
        rmSync(AUTH_INFO_PATH, { recursive: true, force: true });
        mkdirSync(AUTH_INFO_PATH, { recursive: true });
        console.log(`🧹 Session cleared successfully!`);
        return true;
    } catch (e) {
        console.error("Failed to clear session:", e);
        return false;
    }
}
