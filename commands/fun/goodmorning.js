const morningMessages = [
    "Good morning, sunshine ☀️ Just wanted to be the first person to make you smile today. Hope your day is as beautiful as you are 💛",
    "Rise and shine, beautiful! ✨ Another day, another chance to fall in love with you all over again. Have an amazing day 🌹",
    "Hey gorgeous 🌸 I woke up thinking about you (like every morning). Sending you all my love and positive energy today 💫",
    "Good morning to the person who makes my heart race without even trying 💓 I hope today treats you like the queen you are 👑",
    "The sun is out but it's got nothing on your glow ☀️ Good morning, babe. Let's make today unforgettable 💎",
    "Waking up knowing you exist in this world makes every morning worth it 🌅 Have a beautiful day, my love ❤️",
    "GM beautiful! 🌻 If I could, I'd bring you breakfast in bed every morning. For now, this message will have to do. I love you 💘",
    "Every morning I thank God for putting you in my life 🙏 Good morning, sweetheart. You're my everything 🥰",
    "Hey queen 👑 The world is lucky to have you in it today. Go out there and shine like you always do ✨",
    "Morning, my person! 🌞 Just a reminder that someone out here loves you more than you know. Have the best day 💕",
    "Good morning, angel 😇 I dreamt about you last night and waking up to reality was even better because you're real 💫",
    "Rise & grind, beautiful 💪 But first — know that you're deeply loved and appreciated. Now go conquer today! 🔥",
    "Good morning! 🌈 Here's your daily dose of love, care, and 'I'm thinking about you.' You deserve the world 🌍❤️",
    "Hey love 💛 If mornings had a highlight, it would be texting you. You make even waking up early feel worth it ☀️",
    "GM to the reason my phone is the first thing I check every morning 📱 You occupy my heart 24/7. Have a blessed day 🙏💕"
];

export const goodmorning = async (sock, m, args) => {
    const name = args.join(" ") || "";
    const msg = morningMessages[Math.floor(Math.random() * morningMessages.length)];
    const personalMsg = name ? msg.replace(/beautiful|gorgeous|sweetheart|queen|angel|love/i, name) : msg;

    return `╔══════════════════════════════════╗
║   🌅 *𝔾𝕆𝕆𝔻 𝕄𝕆ℝℕ𝕀ℕ𝔾* 🌅            ║
╚══════════════════════════════════╝

💌 *Send this to your babe:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

_"${personalMsg}"_

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ *Best time to send:* 6-8 AM
💡 _Start her day right!_
🔄 _Send again for another message_`;
};
