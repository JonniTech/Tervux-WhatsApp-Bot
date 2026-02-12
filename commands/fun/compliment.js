const compliments = [
    "You're the human equivalent of a perfectly-brewed cup of coffee ☕",
    "Your smile could power a whole city 💡",
    "You're so cool, even ice cubes are jealous 🧊",
    "You're the reason unicorns believe in humans 🦄",
    "If you were a song, you'd be on everyone's playlist 🎵",
    "You're like a ray of sunshine on a rainy day ☀️",
    "Your vibe is immaculate, no cap 🔥",
    "You're the MVP of every room you walk into 🏆",
    "Even Google couldn't find someone as awesome as you 🔍",
    "You're the WiFi signal everyone wants to connect to 📶",
    "Your energy is contagious in the best way ⚡",
    "You're living proof that amazing things exist ✨",
    "You're the plot twist everyone needs in their life 📖",
    "If kindness was currency, you'd be a billionaire 💰",
    "You're lowkey legendary and you don't even know it 👑",
    "Your heart is bigger than your data plan 💜",
    "You make the world a better place just by being in it 🌍",
    "You're the reason they invented the word 'awesome' 🙌",
    "You have main character energy fr fr 🎬",
    "Even your shadow looks confident 😎",
    "You're more refreshing than a cold drink on a hot day 🥤",
    "If you were a meme, you'd go viral instantly 📱",
    "You're the Wi-Fi that never buffers 💪",
    "Your potential is scarier than a horror movie 🚀",
    "You're the 'seen' that actually replies 💬",
    "You have the charisma of a thousand suns ☀️",
    "You're what happens when amazing meets incredible 💫",
    "Even Mondays feel like Fridays around you 🎉",
    "You're proof that God shows off sometimes 🙏",
    "If personality was a sport, you'd be undefeated 🥇",
    "You're smoother than a fresh jar of Nutella 🍫",
    "Your laugh is the best notification sound 🔔",
    "You're the human version of a standing ovation 👏",
    "If vibes were currency, you'd run the economy 💸",
    "You're the final answer on 'Who Wants to Be a Millionaire' 🎯",
    "Your existence is someone's answered prayer 🤲",
    "You're the reason autocorrect was invented — because you're always right ✅",
    "If you were a TikTok, you'd be on everyone's FYP 📲",
    "You're built different, and that's a flex 💪",
    "You make even algorithms recommend you 🤖"
];

export const compliment = async (sock, m, args) => {
    const comp = compliments[Math.floor(Math.random() * compliments.length)];

    return `╔══════════════════════════════════╗
║   🌟 *ℂ𝕆𝕄ℙ𝕃𝕀𝕄𝔼ℕ𝕋* 🌟              ║
╚══════════════════════════════════╝

${comp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_You deserve this and more!_ 💝`;
};
