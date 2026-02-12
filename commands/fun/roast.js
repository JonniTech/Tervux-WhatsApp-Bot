const roasts = [
    "You're the reason God created the middle finger 🖕😂",
    "You bring everyone so much joy... when you leave 👋",
    "If you were any more basic, you'd be a pH 14 solution 🧪",
    "Your WiFi probably disconnects when you walk in 📵",
    "You're like a cloud — everything brightens when you go away ☁️",
    "Even your Google searches come back with 'did you mean someone else?' 🔍",
    "You're the human equivalent of a participation trophy 🏆",
    "If laughter is the best medicine, your face must be curing the world 💊",
    "You have an entire life to be an idiot. Why not take today off? 📅",
    "I'd insult you, but then I'd have to explain it to you 🤷",
    "You're proof that even evolution makes mistakes 🐒",
    "You're like a software update — nobody asked for you 💻",
    "If brains were dynamite, you wouldn't have enough to blow your nose 🧨",
    "You're not stupid, you just have bad luck thinking 🧠",
    "Your family tree must be a cactus because everybody on it is a prick 🌵",
    "You're the reason shampoo has instructions 🧴",
    "I'd send you a 'get well soon' card but there's no cure for what you have 💉",
    "You bring everyone together... by being the common enemy 🤝",
    "Your secrets are always safe with me. I never listen to you anyway 🙉",
    "You're like math homework — nobody wants to do you 📝",
    "You're about as useful as a screen door on a submarine 🚢",
    "Light travels faster than sound, that's why you seemed bright until you spoke 💡",
    "If you were a spice, you'd be flour 🫗",
    "You're the human version of a dead pixel 📺",
    "I'd roast you harder, but my mom said I can't burn trash 🗑️",
    "You're not the dumbest person in the world, but you better hope they don't die 💀",
    "Your gene pool could use a little chlorine 🏊",
    "You're like a penny — two-faced and worthless 🪙",
    "Even Siri pretends she can't hear you 🤖",
    "You're the reason people look both ways before crossing the street 🚶",
    "If you were any denser, you'd be a black hole 🕳️",
    "You have the personality of a wet paper towel 🧻",
    "You're so boring, even your imaginary friends left 👻",
    "I'd agree with you but then we'd both be wrong ❌",
    "You're the 'before' picture in a glow-up video 📸",
    "Your attitude is like a flat tire — you can't go anywhere until you change it 🛞",
    "You're like algebra — why do you have to make everything so complicated? 📐",
    "The only culture you have is bacteria 🦠",
    "You're living proof that nobody's perfect 🤡",
    "Even autocorrect can't fix what's wrong with you 📱"
];

export const roast = async (sock, m, args) => {
    const r = roasts[Math.floor(Math.random() * roasts.length)];

    return `╔══════════════════════════════════╗
║   🔥 *ℝ𝕆𝔸𝕊𝕋𝔼𝔻* 🔥                 ║
╚══════════════════════════════════╝

${r}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Don't take it personal_ 😂🔥
_Just vibes!_`;
};
