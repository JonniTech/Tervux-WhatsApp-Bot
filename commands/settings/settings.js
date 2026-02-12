import { getCachedConfig, updateConfig, invalidateConfigCache } from "../../services/configService.js";

export const settings = async (sock, m, args) => {
    const config = getCachedConfig();
    const p = config.prefix || "!";

    return `╔══════════════════════════════════╗
║   ⚙️ *𝔹𝕆𝕋 𝕊𝔼𝕋𝕋𝕀ℕ𝔾𝕊* ⚙️          ║
╚══════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 *ℂ𝕆ℕ𝔽𝕀𝔾𝕌ℝ𝔸𝕋𝕀𝕆ℕ*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• *Prefix:* ${p}
• *Always Online:* ${config.alwaysOnline ? "✅" : "❌"}
• *Auto Like Status:* ${config.autoLikeStatus ? "✅" : "❌"}
• *Auto View Status:* ${config.autoViewStatus ? "✅" : "❌"}
• *Anti Delete (DMs):* ${config.antiDelete ? "✅" : "❌"}
• *Anti Call:* ${config.antiCall ? "✅" : "❌"}
• *Auto Read:* ${config.autoReadMessages ? "✅" : "❌"}
• *Always Typing:* ${config.alwaysTyping ? "✅" : "❌"}
• *Always Recording:* ${config.alwaysRecording ? "✅" : "❌"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 *ℍ𝕆𝕎 𝕋𝕆 ℂℍ𝔸ℕ𝔾𝔼*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Type commands to toggle:
• *${p}prefix <symbol>* _(change prefix)_
• *${p}alwaysonline on/off*
• *${p}autolikestatus on/off*
• *${p}antidelete on/off* _(DMs only)_
• *${p}groupantidelete on/off* _(per group)_
(and so on for others...)`;
};

