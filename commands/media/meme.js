import axios from "axios";
import { getCachedConfig } from "../../services/configService.js";

export const meme = async (sock, m, args) => {
    const chatJid = m.key.remoteJid;

    const config = getCachedConfig();
    const p = config.prefix || "!";

    try {
        const { data } = await axios.get("https://meme-api.com/gimme", { timeout: 100000 });

        if (!data || !data.url) {
            return `❌ Couldn't fetch a meme right now. Try again!`;
        }

        // Download the meme image
        const imageResponse = await axios.get(data.url, {
            responseType: "arraybuffer",
            timeout: 15000
        });

        const caption = `╔══════════════════════════════════╗
║   😂 *ℝ𝔸ℕ𝔻𝕆𝕄 𝕄𝔼𝕄𝔼* 😂             ║
╚══════════════════════════════════╝

📝 *${data.title}*
👍 ${data.ups || 0} upvotes
📂 r/${data.subreddit}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Send ${p}meme again for another one_ 🔄`;

        await sock.sendMessage(chatJid, {
            image: Buffer.from(imageResponse.data),
            caption
        }, { quoted: m });

        return null;
    } catch (err) {
        console.error("❌ Meme error:", err.message);
        return `❌ *Failed to fetch meme*

_Try again in a moment!_ 🔄`;
    }
};
