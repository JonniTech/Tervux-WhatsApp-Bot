const dateIdeas = [
    // Budget-Friendly
    { idea: "Sunset walk at the park 🌅", cost: "💚 Free", vibe: "Romantic", desc: "Find a nice park, walk together, watch the sunset. Simple but incredibly romantic. Bring a blanket!" },
    { idea: "Cook a meal together 🍳", cost: "💚 Cheap", vibe: "Fun & Intimate", desc: "Pick a recipe neither of you has tried. Cooking together is fun, flirty, and you get food at the end!" },
    { idea: "Stargazing night ⭐", cost: "💚 Free", vibe: "Romantic", desc: "Find a quiet spot away from city lights. Bring a blanket, some snacks, and just look up. Talk about everything." },
    { idea: "Movie marathon at home 🍿", cost: "💚 Cheap", vibe: "Chill & Cozy", desc: "Pick a movie series (Harry Potter, Marvel, etc). Blankets, popcorn, cuddles. Perfect date." },
    { idea: "Photo walk around the city 📸", cost: "💚 Free", vibe: "Adventurous", desc: "Walk around your city/town and take photos of everything cool. You'll discover new spots and make memories!" },
    { idea: "Have a picnic 🧺", cost: "💚 Cheap", vibe: "Classic Romance", desc: "Pack sandwiches, fruits, and drinks. Find a beautiful spot and just enjoy each other's company." },

    // Mid-Range
    { idea: "Try a new restaurant together 🍽️", cost: "💛 Moderate", vibe: "Classic", desc: "Find a cuisine neither of you has tried. Food adventures create the best memories and conversations." },
    { idea: "Ice cream date 🍦", cost: "💛 Cheap", vibe: "Sweet & Playful", desc: "Hit up the best ice cream spot in town. Share flavors, walk and talk. Simple but always works!" },
    { idea: "Arcade / bowling night 🎳", cost: "💛 Moderate", vibe: "Fun & Competitive", desc: "A little friendly competition is always flirty. Bonus: you can teach her how to bowl (smooth move)." },
    { idea: "Art museum or gallery 🎨", cost: "💛 Moderate", vibe: "Classy", desc: "Walk through, discuss the art, pretend you understand the abstract ones. It's cultured and impressive!" },
    { idea: "Karaoke night 🎤", cost: "💛 Moderate", vibe: "Fun & Bold", desc: "Belt out some songs together. Being silly together builds connection faster than being 'cool.'" },
    { idea: "Beach / lake day 🏖️", cost: "💛 Cheap", vibe: "Adventurous", desc: "Swim, build sandcastles, have a splash fight. Bring snacks and a speaker for vibes." },

    // Special
    { idea: "Sunrise breakfast date 🌄", cost: "💛 Moderate", vibe: "Unique & Romantic", desc: "Wake up early, get breakfast, and watch the sunrise together. She'll never forget it." },
    { idea: "Road trip to a nearby town 🚗", cost: "💛 Moderate", vibe: "Adventure", desc: "Pick a cool town 1-2 hours away. Explore, eat local food, and enjoy the drive. Music + conversations = magic." },
    { idea: "Cook-off challenge 👨‍🍳", cost: "💚 Cheap", vibe: "Fun & Flirty", desc: "Each of you makes a dish. Rate each other's cooking. Losers does the dishes. Competitive and fun!" },
    { idea: "Volunteer together 🤝", cost: "💚 Free", vibe: "Meaningful", desc: "Help at a shelter, clean up a park, or volunteer at an event. Shows character and you bond over doing good." }
];

export const dateidea = async (sock, m, args) => {
    const filter = args[0]?.toLowerCase();

    let filtered = dateIdeas;
    if (filter === "free") filtered = dateIdeas.filter(d => d.cost.includes("Free"));
    else if (filter === "cheap") filtered = dateIdeas.filter(d => d.cost.includes("Cheap") || d.cost.includes("Free"));
    else if (filter === "romantic") filtered = dateIdeas.filter(d => d.vibe.includes("Romantic"));
    else if (filter === "fun") filtered = dateIdeas.filter(d => d.vibe.includes("Fun"));
    else if (filter === "adventure") filtered = dateIdeas.filter(d => d.vibe.includes("Adventure") || d.vibe.includes("Adventurous"));

    const date = filtered[Math.floor(Math.random() * filtered.length)];

    return `╔══════════════════════════════════╗
║   💑 *𝔻𝔸𝕋𝔼 𝕀𝔻𝔼𝔸* 💑                ║
╚══════════════════════════════════╝

🎯 *${date.idea}*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 *Budget:* ${date.cost}
🎭 *Vibe:* ${date.vibe}

📝 *How to pull it off:*
${date.desc}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *Filter by type:*
• *!dateidea free* → Free dates
• *!dateidea cheap* → Budget dates
• *!dateidea romantic* → Romantic dates
• *!dateidea fun* → Fun dates
• *!dateidea adventure* → Adventures

🔄 _Send again for another idea!_`;
};
