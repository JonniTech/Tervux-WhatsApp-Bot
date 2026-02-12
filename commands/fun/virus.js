const virusSteps = [
    "⚠️ *SECURITY ALERT* ⚠️",
    "🔴 Malware detected in system...",
    "📡 Scanning device... [██░░░░░░░░] 15%",
    "🦠 Virus found: TROJAN.WhatsApp.2024",
    "📂 Infected files: 247 found... [████░░░░░░] 40%",
    "🔓 Firewall breached... [██████░░░░] 60%",
    "💀 System core compromised... [████████░░] 80%",
    "📱 Device control: TRANSFERRED [██████████] 100%",
];

export const virus = async (sock, m, args) => {
    const chatJid = m.key.remoteJid;

    await sock.sendMessage(chatJid, {
        text: `╔══════════════════════════════════╗
║  ☣️ *𝕍𝕀ℝ𝕌𝕊 𝔻𝔼𝕋𝔼ℂ𝕋𝔼𝔻* ☣️           ║
╚══════════════════════════════════╝

🔴 *CRITICAL SECURITY BREACH*
📱 Initializing remote access...`
    });

    for (const step of virusSteps) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        await sock.sendMessage(chatJid, { text: step });
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    await sock.sendMessage(chatJid, {
        text: `╔══════════════════════════════════╗
║  💀 *𝔻𝔼𝕍𝕀ℂ𝔼 ℂ𝕆𝕄ℙℝ𝕆𝕄𝕀𝕊𝔼𝔻* 💀      ║
╚══════════════════════════════════╝

📋 *Stolen Data:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📸 *Photos:* 1,247 files extracted
💬 *Chats:* 89,432 messages copied
🔑 *Passwords:* 23 accounts cracked
💳 *Banking:* Card **** **** **** 4269
📍 *Location:* Under your bed 👀
🎵 *Spotify:* You listen to Baby Shark
🔍 *Last Search:* "Am I being hacked"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

.
.
.
.

😂😂😂 *GOTCHA!* 😂😂😂

_Relax! This is just a PRANK!_ 🎭
_Your phone is totally safe_ 🛡️
_No data was accessed or stolen_ ✅

╔══════════════════════════════════╗
║    💠 *ℙ𝕠𝕨𝕖𝕣𝕖𝕕 𝕓𝕪 𝕋𝔼ℝ𝕍𝕌𝕏* 💠    ║
╚══════════════════════════════════╝`
    });

    return null;
};
