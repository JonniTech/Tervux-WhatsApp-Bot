const titles = [
    "Walking Red Flag 🚩", "Main Character ⭐", "NPC Energy 🤖", "Side Quest King 👑",
    "Certified Clown 🤡", "Absolute Legend 🏆", "Glow Up Material ✨", "Vibe Check Passed ✅",
    "Touch Grass Award 🌱", "Chronically Online 📱", "Built Different 💪", "Basic Edition ☕",
    "Premium Quality 💎", "Low Battery 🪫", "Full Signal 📶", "Error 404: Drip Not Found 🚫"
];

const descriptions = [
    "You're the person everyone wants at the party but never invites 😂",
    "You could sell ice to a polar bear with that charm 🐻‍❄️",
    "Your energy could power a small country ⚡",
    "You're basically a limited edition human 🏷️",
    "Even your shadow is trying to be like you 😎",
    "You're the WiFi everyone tries to connect to 📶",
    "Your vibe is immaculate, no debate 💯",
    "You're what AI aspires to be 🤖",
    "You're the answered prayer nobody expected 🙏",
    "You're living proof that miracles happen daily ✨",
    "Scientists can't explain how you're this cool 🔬",
    "You're like a software update — always improving 📈",
    "Your presence raises the room's IQ by 20 points 🧠",
    "You're the human equivalent of a warm blanket 🧣",
    "Even Google is jealous of your search results 🔍",
    "You've been voted Most Likely to Go Viral 📲"
];

export const rate = async (sock, m, args) => {
    const target = args[0] || "you";

    const attractiveness = Math.floor(Math.random() * 40) + 60; // 60-100
    const intelligence = Math.floor(Math.random() * 50) + 50; // 50-100
    const humor = Math.floor(Math.random() * 50) + 50; // 50-100
    const charisma = Math.floor(Math.random() * 40) + 60; // 60-100
    const overall = Math.floor((attractiveness + intelligence + humor + charisma) / 4);

    const title = titles[Math.floor(Math.random() * titles.length)];
    const desc = descriptions[Math.floor(Math.random() * descriptions.length)];

    const bar = (val) => {
        const filled = Math.floor(val / 10);
        return "█".repeat(filled) + "░".repeat(10 - filled);
    };

    return `╔══════════════════════════════════╗
║   ⭐ *ℝ𝔸𝕋𝔼 𝕄𝔼* ⭐                  ║
╚══════════════════════════════════╝

🎯 *Target:* ${target}
🏷️ *Title:* ${title}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 *Ratings:*

😍 *Attractiveness:*
[${bar(attractiveness)}] ${attractiveness}%

🧠 *Intelligence:*
[${bar(intelligence)}] ${intelligence}%

😂 *Humor:*
[${bar(humor)}] ${humor}%

✨ *Charisma:*
[${bar(charisma)}] ${charisma}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💯 *Overall Score:* ${overall}/100
${overall >= 85 ? "🔥 *PREMIUM TIER!*" : overall >= 70 ? "✅ *Above Average!*" : "📈 *Room to grow!*"}

💬 "${desc}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Rate someone else!_ 🔄`;
};
