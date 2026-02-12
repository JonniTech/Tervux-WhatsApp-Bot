import { default as makeWASocket, DisconnectReason, useMultiFileAuthState, Browsers, delay } from "@whiskeysockets/baileys";
import pino from "pino";
import { join } from "path";
import { rmSync, mkdirSync, existsSync, readFileSync } from "fs";
import { randomBytes } from "crypto";
import { emitUpdate } from "./socketService.js";

// Temp storage for active pairing sessions
const activePairingSessions = new Map();

/**
 * Generate a unique Session ID
 */
const generateSessionId = () => {
    return "Tervux-" + randomBytes(4).toString("hex").toUpperCase();
};

/**
 * Start a pairing session
 * @param {string} phoneNumber - User's phone number (optional for QR)
 * @param {string} method - "qr" or "code"
 * @param {string} socketId - Socket.IO client ID for targeted updates
 */
export const startPairing = async (phoneNumber, method = "qr", socketId) => {
    // Generate unique session ID and path
    const sessionId = generateSessionId();
    const sessionDir = join(process.cwd(), "sessions", sessionId);

    // Ensure clean state
    if (existsSync(sessionDir)) {
        rmSync(sessionDir, { recursive: true, force: true });
    }
    mkdirSync(sessionDir, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    console.log(`🔌 Starting pairing session: ${sessionId} (${method})`);

    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        auth: state,
        browser: Browsers.ubuntu("Chrome"),
        printQRInTerminal: false, // We send to UI
        markOnlineOnConnect: false,
        generateHighQualityLinkPreview: false,
    });

    // Store session ref
    activePairingSessions.set(sessionId, { sock, socketId, phone: phoneNumber });

    // Handle Pairing Code
    if (method === "code" && phoneNumber) {
        try {
            await delay(2000); // Wait for socket to be ready
            if (!sock.authState.creds.me && !sock.authState.creds.registered) {
                const code = await sock.requestPairingCode(phoneNumber.replace(/\D/g, ""));
                console.log(`[${sessionId}] Pairing Code: ${code}`);
                emitUpdateToSocket(socketId, "pairing_code", { code, sessionId });
            }
        } catch (error) {
            console.error(`[${sessionId}] Failed to request pairing code:`, error);
            emitUpdateToSocket(socketId, "pairing_error", { error: "Failed to generate pairing code" });
        }
    }

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr && method === "qr") {
            console.log(`[${sessionId}] QR Generated`);
            emitUpdateToSocket(socketId, "qr_update", { qr, sessionId });
        }

        if (connection === "open") {
            console.log(`✅ [${sessionId}] Connected Successfully!`);

            // Wait a bit for creds to fully save
            await delay(2000);

            let sessionData = "";
            try {
                const credsPath = join(sessionDir, "creds.json");
                const creds = readFileSync(credsPath);
                sessionData = "Tervux-" + creds.toString("base64");
            } catch (e) {
                console.error(`[${sessionId}] Failed to read creds:`, e);
            }

            // SEND SESSION ID TO USER'S DM
            try {
                const userJid = sock.user.id.split(":")[0] + "@s.whatsapp.net";
                const messageText = `RESULTS OF PAIRING...\n╔══════════════════════════════╗\n║  🤖 *𝕋𝔼ℝ𝕍𝕌𝕏 𝕊𝔼𝕊𝕊𝕀𝕆ℕ* 🤖        ║\n╚══════════════════════════════╝\n\n*Below is your Session ID. Do not share it!*\n\n${sessionData}\n\n*Use this ID to deploy on Heroku.*`;

                await sock.sendMessage(userJid, { text: messageText });
                console.log(`[${sessionId}] Session ID sent to user DM: ${userJid}`);
            } catch (msgErr) {
                console.error(`[${sessionId}] Failed to send DM:`, msgErr);
            }

            emitUpdateToSocket(socketId, "pairing_success", {
                // sessionId removed for security
                message: "Pairing Successful! Check your WhatsApp DM for the Session ID."
            });

            // Close socket after success (we just needed to generate the session files)
            await delay(5000);
            sock.end();
            activePairingSessions.delete(sessionId);
        }

        if (connection === "close") {
            const code = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = code !== DisconnectReason.loggedOut;

            console.log(`[${sessionId}] Connection closed: ${code}`);

            if (code === DisconnectReason.loggedOut) {
                emitUpdateToSocket(socketId, "pairing_error", { error: "Connection timed out or logged out" });
                activePairingSessions.delete(sessionId);
                // Cleanup invalid session
                rmSync(sessionDir, { recursive: true, force: true });
            }
        }
    });

    // Cleanup timeout (5 mins)
    setTimeout(() => {
        if (activePairingSessions.has(sessionId)) {
            console.log(`[${sessionId}] Session timed out`);
            const session = activePairingSessions.get(sessionId);
            session?.sock?.end();
            activePairingSessions.delete(sessionId);
            // Don't delete files if it might have succeeded but just closed
        }
    }, 5 * 60 * 1000);

    return { sessionId };
};

// Helper: Emit only to specific socket client based on ID
// Note: Since we are using a broadcast emit in socketService, we'll implement a targeted emit here.
// But wait, socketService.js only exports `io` and `emitUpdate` (broadcast).
// We need to access `io.to(socketId).emit(...)`.
import { getIO } from "./socketService.js";

const emitUpdateToSocket = (socketId, event, data) => {
    try {
        const io = getIO();
        if (socketId) {
            // If we have a socketId (from frontend), send only to that client
            io.to(socketId).emit(event, data);
        } else {
            // Fallback (shouldn't happen with correct implementation)
            io.emit(event, data);
        }
    } catch (e) {
        console.error("Socket emit error:", e.message);
    }
};
