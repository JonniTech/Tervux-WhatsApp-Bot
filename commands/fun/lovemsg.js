const messages = [
    // Deep & Romantic
    "You're not just the love of my life — you're my best friend, my comfort zone, and my greatest adventure. I love you more than words can say ❤️",
    "I fell in love with you not because of how you look, but because of who you are. Every day with you feels like a blessing 🌹",
    "If I had to choose between breathing and loving you, I would use my last breath to say I love you 💫",
    "You've turned my ordinary days into something magical. Thank you for choosing to love me 🌙",
    "I don't need the whole world to love me. I just need you. And having you is better than having everything else ❤️‍🔥",

    // Sweet & Caring
    "Good things come to those who wait — and you were worth every second of waiting. I'm so grateful you're mine 🥰",
    "Every love song makes sense when I think about you. You're the melody my heart has been searching for 🎵",
    "I love the way you make the bad days feel like they don't exist. You're my peace in this chaotic world 🕊️",
    "You know what's better than saying 'I love you'? Proving it every single day. And I promise to do that, always 💍",
    "When I'm with you, I feel like the luckiest person alive. You make my heart smile in ways I didn't know were possible 😊",

    // Passionate
    "You set my soul on fire in the best way possible. My love for you grows stronger with every heartbeat 🔥",
    "I've loved every version of you — the strong one, the fragile one, the silly one. All of them are perfect to me 💎",
    "My favorite place in the whole world is next to you. Nothing and nobody compares 🌍",
    "I would choose you in a hundred lifetimes, in any version of reality. I'd find you and I'd choose you 💘",
    "You're the reason I believe in forever. Because with you, eternity doesn't feel long enough ♾️",

    // Poetic
    "If kisses were raindrops, I'd send you a storm. If hugs were oceans, I'd give you the sea. If love was a person, it would be you and me 🌊",
    "They say home is where the heart is — my heart is wherever you are 🏠❤️",
    "You came into my life like a dream I never wanted to wake up from 🌙✨",
    "In a world full of temporary things, you are my forever 💫",
    "I look at you and I'm home. I see nothing worse, I see nothing better. I see you 🥺"
];

export const lovemsg = async (sock, m, args) => {
    const msg = messages[Math.floor(Math.random() * messages.length)];

    return `╔══════════════════════════════════╗
║   💌 *𝕃𝕆𝕍𝔼 𝕄𝔼𝕊𝕊𝔸𝔾𝔼* 💌             ║
╚══════════════════════════════════╝

❤️ *For your special someone:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

_"${msg}"_

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 _Copy and send to your babe_ 💕
🔄 _Send again for another message_`;
};
