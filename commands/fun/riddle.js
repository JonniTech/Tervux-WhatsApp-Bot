const riddles = [
    { q: "What has keys but can't open locks?", a: "A piano 🎹" },
    { q: "What has hands but can't clap?", a: "A clock ⏰" },
    { q: "What has a head and a tail but no body?", a: "A coin 🪙" },
    { q: "What gets wetter the more it dries?", a: "A towel 🏖️" },
    { q: "What can you break without touching it?", a: "A promise 💔" },
    { q: "What has one eye but can't see?", a: "A needle 🪡" },
    { q: "What can travel around the world while staying in a corner?", a: "A stamp ✉️" },
    { q: "What has legs but cannot walk?", a: "A table 🪑" },
    { q: "What comes once in a minute, twice in a moment, but never in a thousand years?", a: "The letter M 🔤" },
    { q: "What goes up but never comes down?", a: "Your age 📅" },
    { q: "What has a neck but no head?", a: "A bottle 🍶" },
    { q: "What is full of holes but still holds water?", a: "A sponge 🧽" },
    { q: "The more you take, the more you leave behind. What are they?", a: "Footsteps 👣" },
    { q: "What can you hold in your left hand but not your right?", a: "Your right elbow 💪" },
    { q: "What has teeth but cannot eat?", a: "A comb 💇" },
    { q: "I speak without a mouth and hear without ears. What am I?", a: "An echo 🔊" },
    { q: "What is always in front of you but can't be seen?", a: "The future 🔮" },
    { q: "What can run but never walks, has a mouth but never talks?", a: "A river 🏞️" },
    { q: "What building has the most stories?", a: "A library 📚" },
    { q: "What can fill a room but takes up no space?", a: "Light 💡" },
    { q: "What gets sharper the more you use it?", a: "Your brain 🧠" },
    { q: "What tastes better than it smells?", a: "Your tongue 👅" },
    { q: "What has words but never speaks?", a: "A book 📖" },
    { q: "What invention lets you look right through a wall?", a: "A window 🪟" },
    { q: "What can be cracked, made, told, and played?", a: "A joke 😂" },
    { q: "What is lighter than a feather yet impossible to hold for long?", a: "Your breath 💨" },
    { q: "What has 13 hearts but no other organs?", a: "A deck of cards 🃏" },
    { q: "I have cities but no houses, mountains but no trees, water but no fish. What am I?", a: "A map 🗺️" },
    { q: "What runs all around a backyard but never moves?", a: "A fence 🏡" },
    { q: "What has a bottom at the top?", a: "Your legs 🦵" }
];

export const riddle = async (sock, m, args) => {
    const r = riddles[Math.floor(Math.random() * riddles.length)];

    return `╔══════════════════════════════════╗
║   🧩 *ℝ𝕀𝔻𝔻𝕃𝔼 𝕋𝕀𝕄𝔼* 🧩             ║
╚══════════════════════════════════╝

❓ *${r.q}*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 *Answer:* ||${r.a}||

_Try to guess before peeking!_ 🤔`;
};
