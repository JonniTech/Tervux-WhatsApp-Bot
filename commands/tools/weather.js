import { getCachedConfig } from "../../services/configService.js";
import axios from "axios";

export const weather = async (sock, m, args) => {
    const config = getCachedConfig();
    const p = config.prefix || "!";
    const city = args.join(" ");
    if (!city) {
        return `╔══════════════════════════════════╗
║    🌤️ *𝕋𝔼ℝ𝕍𝕌𝕏 𝕎𝔼𝔸𝕋ℍ𝔼ℝ* 🌤️      ║
╚══════════════════════════════════╝

📝 *𝕌𝕤𝕒𝕘𝕖:* ${p}weather [city]
📌 *𝔼𝕩𝕒𝕞𝕡𝕝𝕖:* ${p}weather Nairobi

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Get real-time weather updates! 🌍`;
    }

    try {
        const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=%c+%t+%w+%h`, { timeout: 8000 });
        const data = response.data;

        if (data.includes("Unknown location")) {
            return `╔══════════════════════════════════╗
║         ❌ *𝔼ℝℝ𝕆ℝ* ❌            ║
╚══════════════════════════════════╝

City not found!
Please check the spelling.`;
        }

        const parts = data.trim().split(" ");
        const icon = parts[0] || "🌡️";
        const temp = parts[1] || "N/A";
        const wind = parts[2] || "N/A";
        const humidity = parts[3] || "N/A";

        return `╔══════════════════════════════════╗
║    🌤️ *𝕋𝔼ℝ𝕍𝕌𝕏 𝕎𝔼𝔸𝕋ℍ𝔼ℝ* 🌤️      ║
╚══════════════════════════════════╝

📍 *𝕃𝕠𝕔𝕒𝕥𝕚𝕠𝕟:* ${city.toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌡️ *ℂ𝕌ℝℝ𝔼ℕ𝕋 ℂ𝕆ℕ𝔻𝕀𝕋𝕀𝕆ℕ𝕊*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${icon} *Condition:* ${icon}
🌡️ *Temperature:* ${temp}
💨 *Wind:* ${wind}
💧 *Humidity:* ${humidity}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Data from wttr.in_ 🌐`;
    } catch (err) {
        console.error("Weather error:", err.message);
        return `╔══════════════════════════════════╗
║         ❌ *𝔼ℝℝ𝕆ℝ* ❌            ║
╚══════════════════════════════════╝

Failed to fetch weather data.
Network busy or timeout.`;
    }
};
