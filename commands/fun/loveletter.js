const intros = [
    "From the moment I first saw you, I knew something inside me had changed forever.",
    "I never believed in fate until the day our paths crossed.",
    "They say the best things in life come unexpectedly — and that's exactly how you came into my world.",
    "I've tried so many times to put what I feel for you into words, and I always fall short. But tonight, I'm going to try.",
    "This letter is long overdue. I've been carrying these feelings in my heart for too long, and you deserve to know."
];

const bodies = [
    "You have this incredible ability to light up any room you walk into. Your smile is contagious, your laugh is my favorite sound, and your kindness is something I admire more than you'll ever know. Being around you makes me want to be a better person — not because you ask me to, but because you inspire me to.",
    "Every time we talk, I discover something new about you that makes me fall a little deeper. The way you care about the people around you, the way your eyes sparkle when you talk about your passions, the way you make even the most ordinary moments feel extraordinary — it all makes my heart race.",
    "I love the way you see the world — with so much hope, kindness, and beauty. You don't realize how rare you are. In a world full of people trying to be something they're not, you're unapologetically yourself, and that's the most attractive thing about you.",
    "What I feel for you goes beyond attraction. It's admiration, respect, and a deep connection that I've never felt with anyone else. You make me feel safe, understood, and truly alive. Every moment with you feels like coming home.",
    "You've taught me what it means to truly care about someone. Not out of obligation, but out of pure, genuine love. My heart chose you before my mind could even catch up, and honestly? It was the best decision I never made."
];

const closings = [
    "I'm not asking for the world — just a chance. A chance to show you how much you mean to me. A chance to be the one who makes you smile every day. 💫",
    "Whatever happens after this, I want you to know: you are loved. Deeply, genuinely, and unconditionally. And I'll be here, no matter what. ❤️",
    "So here's my heart, in words on a screen. It's vulnerable and honest, and it's all yours — if you want it. 💘",
    "I don't know what the future holds, but I know I want you in every version of it. You are my today, my tomorrow, and my forever. 💍",
    "This is me being brave. This is me choosing love over fear. And this is me telling you — you are the most incredible person I've ever known. ✨"
];

export const loveletter = async (sock, m, args) => {
    const name = args.join(" ") || "My Love";
    const intro = intros[Math.floor(Math.random() * intros.length)];
    const body = bodies[Math.floor(Math.random() * bodies.length)];
    const closing = closings[Math.floor(Math.random() * closings.length)];

    return `╔══════════════════════════════════╗
║   💌 *𝕃𝕆𝕍𝔼 𝕃𝔼𝕋𝕋𝔼ℝ* 💌              ║
╚══════════════════════════════════╝

*Dear ${name},* 🌹

${intro}

${body}

${closing}

_Forever yours,_
_Your Secret Admirer_ 🥀

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *!loveletter <her name>*
🔄 _Send again for a new letter_`;
};
