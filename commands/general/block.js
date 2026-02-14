import { getCachedConfig } from "../../services/configService.js";

export const block = async (sock, m, args) => {
    let target = m.key.remoteJid;

    const config = getCachedConfig();
    const p = config.prefix || "!";

    if (m.key.remoteJid.endsWith("@g.us")) {
        if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            target = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (args[0]) {
            target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        } else {
            return `╔══════════════════════════════════╗
║         ❓ *ℍ𝔼𝕃ℙ* ❓             ║
╚══════════════════════════════════╝

📝 *𝕌𝕤𝕒𝕘𝕖 𝕚𝕟 𝔾𝕣𝕠𝕦𝕡𝕤:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Mention: *${p}block @user*
• Number: *${p}block 1234567890*

Please mention or provide a number!`;
        }
    }

    try {
        await sock.updateBlockStatus(target, "block");
        return `╔══════════════════════════════════╗
║     🚫 *𝕌𝕊𝔼ℝ 𝔹𝕃𝕆ℂ𝕂𝔼𝔻* 🚫        ║
╚══════════════════════════════════╝

✅ *𝕊𝕦𝕔𝕔𝕖𝕤𝕤𝕗𝕦𝕝𝕝𝕪 𝕓𝕃𝕠𝕔𝕜𝕖𝕕!*

👤 *𝕌𝕤𝕖𝕣:* @${target.split("@")[0]}
🔒 *𝕊𝕥𝕒𝕥𝕦𝕤:* Blocked

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Use ${p}unblock to undo this action_`;
    } catch (error) {
        return `╔══════════════════════════════════╗
║         ❌ *𝔼ℝℝ𝕆ℝ* ❌            ║
╚══════════════════════════════════╝

Failed to block user.
Please try again later.`;
    }
};
