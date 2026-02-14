import { getCachedConfig } from "../../services/configService.js";

export const dice = async (sock, m, args) => {
    const config = getCachedConfig();
    const p = config.prefix || "!";
    const count = Math.min(parseInt(args[0]) || 1, 6); // Max 6 dice
    const rolls = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
        const value = Math.floor(Math.random() * 6) + 1;
        rolls.push({ value, emoji: diceEmojis[value - 1] });
        total += value;
    }

    const rollDisplay = rolls.map((r, i) => `🎲 Die ${i + 1}: ${r.emoji} *${r.value}*`).join("\n");

    return `╔══════════════════════════════════╗
║   🎲 *𝔻𝕀ℂ𝔼 ℝ𝕆𝕃𝕃* 🎲               ║
╚══════════════════════════════════╝

${rollDisplay}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💯 *Total:* ${total}${count > 1 ? `\n📊 *Average:* ${(total / count).toFixed(1)}` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *${p}dice 3* → Roll 3 dice (max 6)
_Roll again?_ 🔄`;
};
