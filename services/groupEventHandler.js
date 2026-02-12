import { loadGroupSettings, saveGroupSettings } from "./groupSettingsService.js";
import { isAdmin, isBotAdmin, getGroupMetadata } from "../utils/groupUtils.js";

/**
 * Handle Group Participants Update (Welcome/Goodbye)
 */
export async function handleGroupParticipantsUpdate(sock, update) {
    const { id, participants, action } = update;

    // Only handle add/remove
    if (action !== "add" && action !== "remove") return;

    console.log(`👥 [GroupEvent] Participants update: action=${action}, group=${id}, participants=${participants.join(", ")}`);

    try {
        const settings = loadGroupSettings(id);
        console.log(`📋 [GroupEvent] Settings loaded: welcome.enabled=${settings.welcome?.enabled}, goodbye.enabled=${settings.goodbye?.enabled}`);

        const metadata = await getGroupMetadata(sock, id);
        if (!metadata) {
            console.error(`❌ [GroupEvent] Failed to get group metadata for ${id}`);
            return;
        }

        const groupName = metadata?.subject || "Group";
        const desc = metadata?.desc?.toString() || "";

        for (const participant of participants) {
            let messageText = "";
            let isWelcome = false;

            if (action === "add" && settings.welcome?.enabled) {
                messageText = settings.welcome.message || "";
                isWelcome = true;
                console.log(`✅ [GroupEvent] Welcome is enabled, preparing message for ${participant}`);
            } else if (action === "remove" && settings.goodbye?.enabled) {
                messageText = settings.goodbye.message || "";
                console.log(`✅ [GroupEvent] Goodbye is enabled, preparing message for ${participant}`);
            } else {
                console.log(`ℹ️ [GroupEvent] ${action === "add" ? "Welcome" : "Goodbye"} is disabled for group ${id}`);
            }

            if (messageText) {
                // Replace placeholders
                const user = `@${participant.split("@")[0]}`;
                const count = metadata?.participants?.length || "?";

                messageText = messageText
                    .replace(/{group}/g, groupName)
                    .replace(/{desc}/g, desc)
                    .replace(/{count}/g, count)
                    .replace(/@user/g, user);

                // Send message
                await sock.sendMessage(id, {
                    text: messageText,
                    mentions: [participant]
                });
                console.log(`📢 Sent ${isWelcome ? 'Welcome' : 'Goodbye'} message to ${id}`);
            }
        }
    } catch (err) {
        console.error("Error handling group participants update:", err.message);
    }
}

/**
 * Handle Group Messages (Antilink, Antispam)
 */
export async function handleGroupMessage(sock, m) {
    if (!m.message) return false;

    const remoteJid = m.key.remoteJid;
    if (!remoteJid.endsWith("@g.us")) return false;

    // Skip bot's own messages - check both fromMe flag and JID comparison
    if (m.key.fromMe) return false;
    const sender = m.key.participant || m.key.remoteJid;
    const botJid = (sock.user?.id?.split("@")[0]?.split(":")[0]) + "@s.whatsapp.net";
    if (sender.split(":")[0].split("@")[0] === botJid.split("@")[0]) return false;

    const settings = loadGroupSettings(remoteJid);

    // 1. Antilink Check
    if (settings.antilink?.enabled) {
        const msgText = m.message.conversation ||
            m.message.extendedTextMessage?.text ||
            m.message.imageMessage?.caption || "";

        // Check for WhatsApp links
        if (msgText.includes("chat.whatsapp.com")) {
            // Check if sender is admin (exempt)
            const senderIsAdmin = await isAdmin(sock, remoteJid, sender);

            if (!senderIsAdmin) {
                console.log(`🛡️ Antilink triggered for ${sender} in ${remoteJid}`);

                // Check if bot is admin before trying to delete/kick
                const botIsAdmin = await isBotAdmin(sock, remoteJid);

                if (!botIsAdmin) {
                    await sock.sendMessage(remoteJid, {
                        text: `🚫 *Link Detected!* I need admin privileges to manage antilink.`
                    });
                    return true;
                }

                // Delete message
                await sock.sendMessage(remoteJid, { delete: m.key });

                // Check action
                if (settings.antilink.action === "kick") {
                    await sock.groupParticipantsUpdate(remoteJid, [sender], "remove");
                    await sock.sendMessage(remoteJid, {
                        text: `🚫 *Link Detected!* @${sender.split("@")[0]} has been kicked.`,
                        mentions: [sender]
                    });
                } else {
                    // Just warn
                    await sock.sendMessage(remoteJid, {
                        text: `⚠️ @${sender.split("@")[0]}, links are not allowed in this group!`,
                        mentions: [sender]
                    });
                }
                return true; // Stop processing command/other things
            }
        }
    }

    // 2. Antispam (basic placeholder for now)
    // if (settings.antispam?.enabled) { ... }

    return false; // Continue processing
}

