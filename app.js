import express from "express";
import cors from "cors";
import { whatsappService } from "./services/whatsappService.js";
import { getCachedConfig, updateConfig, invalidateConfigCache } from "./services/configService.js";

const app = express();
import { startPairing } from "./services/pairingService.js";
import { join } from "path";

// Serve static files (HTML, CSS, JS) from public directory
app.use(express.static("public"));


app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.json({ status: "OK", service: "Tervux WhatsApp Bot" });
});

// Bot status
app.get("/api/status", (req, res) => {
    const client = whatsappService.getClient();
    const config = getCachedConfig();

    res.json({
        connected: !!(client && client.user),
        phone: config.phone || null,
        name: config.name || null,
        settings: {
            alwaysOnline: config.alwaysOnline,
            autoLikeStatus: config.autoLikeStatus,
            autoViewStatus: config.autoViewStatus,
            antiDelete: config.antiDelete,
            antiCall: config.antiCall,
            autoReadMessages: config.autoReadMessages,
            alwaysTyping: config.alwaysTyping,
            alwaysRecording: config.alwaysRecording
        }
    });
});

// Update settings
app.post("/api/settings", (req, res) => {
    try {
        const allowedSettings = [
            "alwaysOnline", "autoLikeStatus", "autoViewStatus",
            "antiDelete", "antiCall", "autoReadMessages",
            "alwaysTyping", "alwaysRecording", "antiViewOnce",
            "antiRemove", "prefix", "ownerNumber"
        ];

        const updates = {};
        for (const key of allowedSettings) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "No valid settings provided" });
        }

        updateConfig(updates);
        invalidateConfigCache();

        res.json({ success: true, updated: updates });
    } catch (error) {
        console.error("Settings update error:", error);
        res.status(500).json({ error: "Failed to update settings" });
    }
});

// Restart bot connection
app.post("/api/restart", async (req, res) => {
    try {
        await whatsappService.restart();
        res.json({ success: true, message: "Bot restarting..." });
    } catch (error) {
        console.error("Restart error:", error);
        res.status(500).json({ error: "Failed to restart bot" });
    }
});

// Logout and clear session
app.post("/api/logout", async (req, res) => {
    try {
        await whatsappService.logout();
        res.json({ success: true, message: "Logged out. Restart to scan new QR code." });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Failed to logout" });
    }
});

// Pairing API
app.post("/api/pair", async (req, res) => {
    try {
        const { phoneNumber, method, socketId } = req.body;

        if (!socketId) {
            return res.status(400).json({ error: "Socket ID is required" });
        }

        const result = await startPairing(phoneNumber, method, socketId);
        res.json(result);
    } catch (error) {
        console.error("Pairing API Error:", error);
        res.status(500).json({ error: "Failed to start pairing" });
    }
});

// Serve the pairing page specifically at /pair
app.get("/pair", (req, res) => {
    res.sendFile(join(process.cwd(), "public", "pair.html"));
});

export default app;
