import axios from "axios";

const categories = ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug", "awoo", "kiss", "lick", "pat", "smug", "bonk", "yeet", "blush", "smile", "wave", "highfive", "handhold", "nom", "bite", "slap", "happy", "wink", "poke", "dance", "cringe"];

export const waifu = async (sock, m, args) => {
    const chatJid = m.key.remoteJid;
    const category = args[0]?.toLowerCase() || "waifu";

    // Validate category
    const type = categories.includes(category) ? category : "waifu";
    const isSFW = true; // Always SFW

    try {
        const { data } = await axios.get(
            `https://api.waifu.pics/sfw/${type}`,
            { timeout: 10000 }
        );

        if (!data?.url) {
            return `❌ Couldn't fetch waifu image. Try again!`;
        }

        const imgResponse = await axios.get(data.url, {
            responseType: "arraybuffer",
            timeout: 15000
        });

        const caption = `╔══════════════════════════════════╗
║   🌸 *𝕎𝔸𝕀𝔽𝕌 𝔾𝔼ℕ𝔼ℝ𝔸𝕋𝕆ℝ* 🌸         ║
╚══════════════════════════════════╝

🏷️ *Category:* ${type}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 *Categories:*
waifu • neko • shinobu • megumin 
hug • kiss • pat • smile • wave
dance • bonk • yeet • slap • wink
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Example:* !waifu neko
_Send again for another_ 🔄`;

        await sock.sendMessage(chatJid, {
            image: Buffer.from(imgResponse.data),
            caption
        }, { quoted: m });

        return null;
    } catch (err) {
        console.error("❌ Waifu error:", err.message);
        return `❌ *Failed to fetch waifu*

💡 _Try again or use a specific category._
*Available:* waifu, neko, shinobu, hug, pat, smile`;
    }
};
