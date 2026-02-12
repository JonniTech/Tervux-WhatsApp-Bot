const nightMessages = [
    "Good night, beautiful 🌙 Close your eyes knowing that someone out here loves you with everything they have. Sweet dreams 💫",
    "Hey queen 👑 The stars are out tonight, but none of them shine as bright as you. Sleep tight, my love 🌟",
    "Goodnight, baby 🥰 I wish I could be there to hold you, but for now, let this message wrap you in warmth. I love you ❤️",
    "The day is over but my love for you never sleeps 💘 Rest well, gorgeous. Tomorrow we fall in love all over again 🌹",
    "Night night 🌙 If you can't sleep, just know I'm probably awake thinking about you too. You're always on my mind 💭",
    "Sweet dreams, my angel 😇 I hope you dream about us and all the beautiful things we'll do together 🦋",
    "Goodnight to the person who makes my heart full 💓 You are the last thing I think about before I close my eyes 🌙",
    "Hey love 💛 Before you sleep — remember you are loved, you are beautiful, and you are enough. Always. Goodnight ✨",
    "The moon is out, the world is quiet, and all I want is for you to know — you are my peace 🕊️ Sleep well, babe 💫",
    "Goodnight, sweetheart 💕 Thank you for being you. Thank you for loving me. Thank you for existing. See you in my dreams 🛌",
    "One more day done, one more day of loving you ❤️ Goodnight, queen. You deserve the most peaceful sleep tonight 😴",
    "If I could tuck you in through this phone, I would 📱💕 For now, here's a virtual goodnight kiss. Sleep tight 😘",
    "Sending you love across the distance tonight 🌍💞 No matter how far apart we are, you're always close to my heart 💝",
    "Hey gorgeous 🌸 Fun fact: you were the best part of my day. Again. Like always. Goodnight, my whole heart 💗",
    "Before you drift off — just know that waking up to your texts is the reason I look forward to tomorrow 🌅 Dream big, baby 🌙"
];

export const goodnight = async (sock, m, args) => {
    const name = args.join(" ") || "";
    const msg = nightMessages[Math.floor(Math.random() * nightMessages.length)];
    const personalMsg = name ? msg.replace(/beautiful|gorgeous|sweetheart|queen|angel|love/i, name) : msg;

    return `╔══════════════════════════════════╗
║   🌙 *𝔾𝕆𝕆𝔻 ℕ𝕀𝔾ℍ𝕋* 🌙              ║
╚══════════════════════════════════╝

💌 *Send this to your babe:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

_"${personalMsg}"_

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌙 *Best time to send:* 9-11 PM
💡 _End her day with love!_
🔄 _Send again for another message_`;
};
