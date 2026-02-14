import { getCachedConfig } from "../../services/configService.js";

export const fact = async (sock, m, args) => {
    const config = getCachedConfig();
    const p = config.prefix || "!";
    const facts = [
        "Honey never spoils. You can eat honey from 3,000 years ago.",
        "Octopuses have three hearts and blue blood.",
        "Bananas are berries, but strawberries aren't.",
        "A day on Venus is longer than a year on Venus.",
        "There are more trees on Earth than stars in the Milky Way.",
        "Humans share 50% of their DNA with bananas.",
        "Wombat poop is cube-shaped to keep it from rolling away.",
        "A group of flamingos is called a 'flamboyance'.",
        "The inventory of the Eiffel Tower's light bulbs takes 20,000 bulbs.",
        "Chewing gum is banned in Singapore."
    ];

    const randomFact = facts[Math.floor(Math.random() * facts.length)];

    return `╔══════════════════════════════════╗
║   🧠 *𝕋𝔼ℝ𝕍𝕌𝕏 𝔽𝔸ℂ𝕋 ℤ𝕆ℕ𝔼* 🧠    ║
╚══════════════════════════════════╝

💡 *𝔻𝕚𝕕 𝕪𝕠𝕦 𝕜𝕟𝕠𝕨?*

${randomFact}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 Type *${p}fact* for more knowledge!`;
};
