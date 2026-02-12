import axios from "axios";

const categories = [
    "nature", "wallpapers", "architecture", "travel", "textures-patterns",
    "street-photography", "animals", "food-drink"
];

export const wallpaper = async (sock, m, args) => {
    const chatJid = m.key.remoteJid;
    const query = args.join(" ") || categories[Math.floor(Math.random() * categories.length)];

    try {
        // Use Unsplash source for random images (no API key needed)
        const imageUrl = `https://source.unsplash.com/1080x1920/?${encodeURIComponent(query)}`;

        const response = await axios.get(imageUrl, {
            responseType: "arraybuffer",
            timeout: 15000,
            maxRedirects: 5
        });

        const caption = `╔══════════════════════════════════╗
║   🖼️ *ℍ𝔻 𝕎𝔸𝕃𝕃ℙ𝔸ℙ𝔼ℝ* 🖼️            ║
╚══════════════════════════════════╝

🏷️ *Category:* ${query}
📐 *Resolution:* 1080 x 1920

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 *Tips:*
• *${query}* → specific wallpaper
• *!wallpaper* → random wallpaper
• *!wallpaper space* → space themed
• *!wallpaper anime* → anime themed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Send again for a new wallpaper_ 🔄`;

        await sock.sendMessage(chatJid, {
            image: Buffer.from(response.data),
            caption
        }, { quoted: m });

        return null;
    } catch (err) {
        console.error("❌ Wallpaper error:", err.message);
        return `❌ *Failed to fetch wallpaper*

💡 _Try a different category or try again._
*Example:* !wallpaper sunset`;
    }
};
