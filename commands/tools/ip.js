import axios from "axios";

export const ip = async (sock, m, args) => {
    const target = args[0];

    if (!target) {
        return `╔══════════════════════════════════╗
║   🌐 *𝕀ℙ 𝕃𝕆𝕆𝕂𝕌ℙ* 🌐               ║
╚══════════════════════════════════╝

*Usage:* !ip <address or domain>
*Example:*
• *!ip 8.8.8.8*
• *!ip google.com*`;
    }

    try {
        const { data } = await axios.get(
            `http://ip-api.com/json/${encodeURIComponent(target)}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`,
            { timeout: 10000 }
        );

        if (data.status === "fail") {
            return `╔══════════════════════════════════╗
║   🌐 *𝕀ℙ 𝕃𝕆𝕆𝕂𝕌ℙ* 🌐               ║
╚══════════════════════════════════╝

❌ Lookup failed for "*${target}*"
*Reason:* ${data.message || "Invalid IP/domain"}

💡 _Check the address and try again._`;
        }

        return `╔══════════════════════════════════╗
║   🌐 *𝕀ℙ 𝕃𝕆𝕆𝕂𝕌ℙ* 🌐               ║
╚══════════════════════════════════╝

🔍 *Target:* ${target}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 *Location:*
• 🌍 *Country:* ${data.country} (${data.countryCode})
• 🏙️ *City:* ${data.city}
• 📍 *Region:* ${data.regionName}
• 📮 *ZIP:* ${data.zip || "N/A"}
• 🕐 *Timezone:* ${data.timezone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖥️ *Network:*
• 📡 *ISP:* ${data.isp}
• 🏢 *Org:* ${data.org || "N/A"}
• 🔢 *IP:* ${data.query}
• 🌐 *AS:* ${data.as || "N/A"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Coordinates:*
${data.lat}, ${data.lon}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ _Data from public databases._`;
    } catch (err) {
        return `❌ IP lookup failed: ${err.message}`;
    }
};
