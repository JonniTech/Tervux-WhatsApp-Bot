const openers = [
    // Smooth & Confident
    "Hey, I just wanted to say... your vibe is magnetic. I couldn't stop myself from texting you 💫",
    "I don't normally do this, but there's something about you that made me want to reach out. Hope that's okay 😊",
    "I know this is random, but I saw your status and you caught my attention. What's your story? 📖",
    "Hey! I've been wanting to talk to you for a while now. Life's too short to keep waiting, right? 😄",
    "I'll be honest — I've been thinking about texting you all day. So here I am. No regrets 💯",

    // Playful & Fun
    "So I asked my friends for the best conversation starter and they said 'just be yourself.' Here I am being nervous but going for it anyway 😅",
    "Quick question — do you believe in coincidence? Because I feel like we were meant to cross paths 🤔✨",
    "I was going to wait for the perfect moment to text you, then I realized every moment with you could be perfect 🌹",
    "On a scale of 1-10, how surprised are you that I finally texted you? Be honest 😂",
    "I had this whole smooth intro planned out but honestly, I'd rather just be real — I think you're amazing 💎",

    // Sweet & Genuine
    "Hey, I just wanted you to know that your smile makes my whole day better. Even through a screen 😊",
    "Every time I see you online, I want to text you but I get shy. Today I chose courage over fear 💪",
    "I'm not the best with words, but I know what I feel — and what I feel when I think about you is something special ❤️",
    "Some people search their whole lives for the right person. I think I found mine the day I met you 🌟",
    "I don't need a pickup line because everything about you already picked me up 💘",

    // Thoughtful
    "I noticed how kind you are to everyone around you. That's rare and honestly so attractive. Just wanted you to know 🙏",
    "You know what I admire about you? You're real in a world full of fake people. That's worth more than gold 👑",
    "I think the best conversations start with honesty — so honestly, I've had a crush on you for a while now 😳",
    "I was listening to music and a love song came on, and all I could think about was you 🎵❤️",
    "You deserve someone who makes you feel like the most special person in the world. I want to be that person 🌍"
];

const tips = [
    "💡 *Tip:* Be confident but not arrogant. Show genuine interest in HER, not just her looks.",
    "💡 *Tip:* Ask open-ended questions. Instead of 'how are you?', try 'what made you smile today?'",
    "💡 *Tip:* Don't double text if she doesn't reply immediately. Give her space and time.",
    "💡 *Tip:* Compliment something specific — her taste in music, her humor, her intelligence.",
    "💡 *Tip:* Be yourself. The right person will appreciate the real you, not a character.",
    "💡 *Tip:* Listen more than you talk. Girls notice when you actually pay attention to what they say.",
    "💡 *Tip:* Don't start with 'hey' — it's boring. Reference something you both share or something unique about her.",
    "💡 *Tip:* Humor is your best friend. Make her laugh and she'll always want to talk to you.",
    "💡 *Tip:* Be patient. Real connections take time. Don't rush or pressure her.",
    "💡 *Tip:* Show you care through small gestures — remember details she mentions, follow up on things.",
    "💡 *Tip:* Confidence comes from knowing your worth. You don't need her to complete you, you want her to complement you.",
    "💡 *Tip:* Never compare her to other girls. She wants to feel like the only one."
];

export const flirt = async (sock, m, args) => {
    const opener = openers[Math.floor(Math.random() * openers.length)];
    const tip = tips[Math.floor(Math.random() * tips.length)];

    return `╔══════════════════════════════════╗
║   💘 *𝔽𝕃𝕀ℝ𝕋 𝔸𝕊𝕊𝕀𝕊𝕋𝔸ℕ𝕋* 💘          ║
╚══════════════════════════════════╝

✉️ *Message to send her:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

_"${opener}"_

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${tip}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 _Copy, personalize, and send!_
🔄 _Send again for another message_

_Remember: Be genuine, be patient,_
_and be yourself_ 👑`;
};
