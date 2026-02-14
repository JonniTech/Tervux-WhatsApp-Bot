import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { exec } from "child_process";
import { writeFile, unlink, readFile } from "fs/promises";
import path from "path";
import os from "os";
import { randomBytes } from "crypto";
import { getCachedConfig } from "../../services/configService.js";

export const sticker = async (sock, m, args) => {
    const config = getCachedConfig();
    const p = config.prefix || "!";
    const chatJid = m.key.remoteJid;

    // Determine the message containing the media
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const msg = quoted ? quoted : m.message;
    const mime = (msg.imageMessage || msg.videoMessage || msg.stickerMessage)?.mimetype || "";

    if (!/image|video|sticker/.test(mime)) {
        return `╔══════════════════════════════════╗
║   🖼️ *𝕊𝕋𝕀ℂ𝕂𝔼ℝ 𝕄𝔸𝕂𝔼ℝ* 🖼️          ║
╚══════════════════════════════════╝

*How to use:*

1️⃣ Send an image/video with caption *${p}sticker*
2️⃣ Or reply to media with *${p}sticker*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 _Supports JPG, PNG, WEBP, and MP4_
📏 _Stickers will be auto-resized to 512x512_`;
    }

    try {
        console.log(`📥 Downloading media for sticker... MIME: ${mime}`);

        // Use Baileys utility to download message buffer
        const buffer = await downloadMediaMessage(
            m.message?.extendedTextMessage?.contextInfo ? { message: quoted } : m,
            "buffer",
            {},
            {
                logger: console,
                reuploadRequest: sock.updateMediaMessage
            }
        );

        if (!buffer) throw new Error("Failed to download media buffer.");

        const tempId = randomBytes(6).toString("hex");
        const inputPath = path.join(os.tmpdir(), `input_${tempId}`);
        const outputPath = path.join(os.tmpdir(), `output_${tempId}.webp`);

        await writeFile(inputPath, buffer);

        // FFmpeg command to convert to 512x512 WebP
        // If it's a video/gif, we take the first frame or loop it (for now just handling static conversion for simplicity, 
        // but adding basic video support via -vframes 1)
        const ffmpegCmd = mime.includes("video")
            ? `ffmpeg -i ${inputPath} -vframes 1 -vf "scale='if(gt(iw,ih),512,-1)':'if(gt(iw,ih),-1,512)',pad=512:512:(512-iw)/2:(512-ih)/2:color=white@0" -c:v libwebp ${outputPath}`
            : `ffmpeg -i ${inputPath} -vf "scale='if(gt(iw,ih),512,-1)':'if(gt(iw,ih),-1,512)',pad=512:512:(512-iw)/2:(512-ih)/2:color=white@0" -c:v libwebp ${outputPath}`;

        console.log(`🎬 Converting to WebP...`);

        await new Promise((resolve, reject) => {
            exec(ffmpegCmd, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });

        const stickerBuffer = await readFile(outputPath);

        // Send sticker
        await sock.sendMessage(chatJid, {
            sticker: stickerBuffer,
            mimetype: "image/webp",
            stickerMetadata: {
                packname: "Tervux Bot",
                author: "tervux.com"
            }
        }, { quoted: m });

        // Cleanup
        await unlink(inputPath).catch(() => { });
        await unlink(outputPath).catch(() => { });

        return null;
    } catch (err) {
        console.error("❌ Sticker error:", err.message);
        return `❌ *Failed to create sticker*

*Error:* ${err.message}

💡 _Make sure you're replying to a valid image or video._`;
    }
};
