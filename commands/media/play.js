import yts from "yt-search";
import axios from "axios";
import { getCachedConfig } from "../../services/configService.js";

export const play = async (sock, m, args) => {
    const config = getCachedConfig();
    const p = config.prefix || "!";

    const query = args.join(" ");
    if (!query) {
        return `╔══════════════════════════════════╗
║    🎵 *𝕋𝔼ℝ𝕍𝕌𝕏 𝕄𝕌𝕊𝕀ℂ* 🎵           ║
╚══════════════════════════════════╝

📝 *𝕌𝕤𝕒𝕘𝕖:* ${p}play [song name]
📌 *𝔼𝕩𝕒𝕞𝕡𝕝𝕖:* ${p}play Burna Boy Last Last

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Download any song instantly! 🎧`;
    }

    try {
        const search = await yts(query);
        const video = search.videos[0];

        if (!video) {
            return `╔══════════════════════════════════╗
║       ❌ *ℕ𝕆𝕋 𝔽𝕆𝕌ℕ𝔻* ❌          ║
╚══════════════════════════════════╝

Song not found.
Try a different search term.`;
        }

        const message = `╔══════════════════════════════════╗
║      🎵 *ℙ𝕃𝔸𝕐𝕀ℕ𝔾 𝕄𝕌𝕊𝕀ℂ* 🎵        ║
╚══════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *𝕋ℝ𝔸ℂ𝕂 𝕀ℕ𝔽𝕆*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 *𝕋𝕚𝕥𝕝𝕖:* ${video.title}
⏱️ *𝔻𝕦𝕣𝕒𝕥𝕚𝕠𝕟:* ${video.timestamp}
👀 *𝕍𝕚𝕖𝕨𝕤:* ${video.views}
🔗 *𝕃𝕚𝕟𝕜:* ${video.url}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Downloading audio... please wait._ ⏳`;

        // SAFE MEDIA DELIVERY
        let thumbnailBuffer;
        try {
            const thumbRes = await axios.get(video.thumbnail, { responseType: 'arraybuffer', timeout: 5000 });
            thumbnailBuffer = Buffer.from(thumbRes.data);
        } catch (e) {
            console.warn("Failed to download thumbnail, proceeding without it.");
        }

        const sentMsg = await sock.sendMessage(m.key.remoteJid, {
            ...(thumbnailBuffer ? { image: thumbnailBuffer } : { text: message }),
            ...(thumbnailBuffer ? { caption: message } : {}),
            linkPreview: null
        }, { quoted: m });


        // Try to download audio with local yt-dlp
        try {
            const { downloadYT } = await import("../../utils/ytdl.js");
            const audioBuffer = await downloadYT(video.url, 'audio');

            if (!audioBuffer || audioBuffer.length < 1000) {
                throw new Error("Downloaded audio file is invalid or empty.");
            }

            await sock.sendMessage(m.remoteJid || m.key.remoteJid, {
                audio: audioBuffer,
                mimetype: 'audio/mp4', // WhatsApp sometimes prefers mp4 for audio
                fileName: `${video.title}.mp3`,
                ptt: false
            }, { quoted: m });

        } catch (downloadErr) {
            console.error("Audio download failed:", downloadErr.message);
            await sock.sendMessage(m.key.remoteJid, {
                text: `╔══════════════════════════════════╗
║        ❌ *𝔼ℝℝ𝕆ℝ* ❌             ║
╚══════════════════════════════════╝

⚠️ *Download failed:*
${downloadErr.message}

👇 Please use the link above to listen.`
            }, { quoted: m });
        }

    } catch (err) {
        console.error("Play error:", err.message);
        return `╔══════════════════════════════════╗
║         ❌ *𝔼ℝℝ𝕆ℝ* ❌            ║
╚══════════════════════════════════╝

Failed to process music request.`;
    }
};
