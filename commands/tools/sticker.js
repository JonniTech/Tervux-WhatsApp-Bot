export const sticker = async (sock, m, args) => {
    const chatJid = m.key.remoteJid;

    // Check if message is a reply to an image or has an image
    const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const imageMsg = m.message?.imageMessage || quotedMsg?.imageMessage;

    if (!imageMsg) {
        return `╔══════════════════════════════════╗
║   🖼️ *𝕊𝕋𝕀ℂ𝕂𝔼ℝ 𝕄𝔸𝕂𝔼ℝ* 🖼️          ║
╚══════════════════════════════════╝

*How to use:*

1️⃣ Send an image with caption *!sticker*
2️⃣ Or reply to an image with *!sticker*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 _Supports JPG, PNG, and WEBP images_
📏 _Images will be auto-resized_`;
    }

    try {
        // Download the image
        const stream = await sock.downloadMediaMessage(
            quotedMsg ? { message: quotedMsg, key: m.message.extendedTextMessage.contextInfo.stanzaId } : m,
            "buffer"
        );

        // Send as sticker
        await sock.sendMessage(chatJid, {
            sticker: stream,
            mimetype: "image/webp",
            stickerMetadata: {
                packname: "Tervux Bot",
                author: "tervux.com"
            }
        }, { quoted: m });

        return null; // Already sent
    } catch (err) {
        console.error("❌ Sticker error:", err.message);

        // Fallback: try direct download approach
        try {
            const buffer = await sock.downloadMediaMessage(m, "buffer");
            await sock.sendMessage(chatJid, {
                sticker: buffer,
                mimetype: "image/webp"
            }, { quoted: m });
            return null;
        } catch (fallbackErr) {
            return `❌ *Failed to create sticker*

*Error:* ${err.message}

💡 _Make sure you're sending or replying to an image._`;
        }
    }
};
