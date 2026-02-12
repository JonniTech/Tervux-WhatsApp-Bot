const pickupLines = [
    "Are you a magician? Because whenever I look at you, everyone else disappears. ✨",
    "Do you have a map? I keep getting lost in your eyes. 🗺️",
    "Is your name Google? Because you have everything I've been searching for. 🔍",
    "Are you a parking ticket? Because you've got 'fine' written all over you. 🎫",
    "Do you have a Band-Aid? I just scraped my knee falling for you. 💕",
    "Is your dad a boxer? Because you're a knockout! 🥊",
    "Are you a campfire? Because you're hot and I want s'more. 🔥",
    "Do you believe in love at first sight, or should I walk by again? 😏",
    "If you were a vegetable, you'd be a cute-cumber. 🥒",
    "Are you a Wi-Fi signal? Because I'm feeling a connection. 📶",
    "Is your name Chapati? Because you're making me feel warm inside. 🫓",
    "Do you have a sunburn, or are you always this hot? ☀️",
    "If beauty were time, you'd be an eternity. ⏳",
    "Are you a bank loan? Because you've got my interest. 💰",
    "Is there an airport nearby, or is that just my heart taking off? ✈️",
    "You must be a ninja, because you snuck into my heart. 🥷",
    "Are you a keyboard? Because you're just my type. ⌨️",
    "If you were a Transformer, you'd be Optimus Fine. 🤖",
    "Do you have a mirror in your pocket? Because I can see myself in your future. 🪞",
    "Are you a dictionary? Because you add meaning to my life. 📖",
    "Is your dad an artist? Because you're a masterpiece. 🎨",
    "You must be made of copper and tellurium, because you're Cu-Te. ⚗️",
    "Are you a time traveler? Because I can see you in my future. ⏰",
    "If kisses were snowflakes, I'd send you a blizzard. ❄️",
    "Are you a camera? Because every time I look at you, I smile. 📸",
    "You're so sweet, you're giving me a toothache. 🍬",
    "Do you play soccer? Because you're a keeper. ⚽",
    "Are you a charger? Because I'd die without you. 🔋",
    "If you were a fruit, you'd be a fineapple. 🍍",
    "Are you a cat? Because you're purrfect. 🐱",
    "Is your name Netflix? Because I could watch you for hours. 📺",
    "You must be a broom, because you just swept me off my feet. 🧹",
    "Are you a light switch? Because you really turn me on. 💡",
    "If I were a stoplight, I'd turn red every time you passed by so I could stare at you longer. 🚦",
    "Are you a 90-degree angle? Because you're looking right! 📐",
    "You're like a fine wine — you just keep getting better with time. 🍷",
    "Are you made of grapes? Because you're fine as wine. 🍇",
    "I must be a snowflake, because I've fallen for you. ❄️",
    "Are you a volcano? Because you make my heart erupt. 🌋",
    "If looks could kill, you'd be a weapon of mass destruction. 💣"
];

export const pickup = async (sock, m, args) => {
    const line = pickupLines[Math.floor(Math.random() * pickupLines.length)];

    return `╔══════════════════════════════════╗
║   💘 *ℙ𝕀ℂ𝕂𝕌ℙ 𝕃𝕀ℕ𝔼* 💘             ║
╚══════════════════════════════════╝

${line}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Send again for another line_ 😉`;
};
