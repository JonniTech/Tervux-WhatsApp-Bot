const triviaQuestions = [
    { q: "What is the largest planet in our solar system?", options: ["Mars", "Jupiter", "Saturn", "Neptune"], answer: 1 },
    { q: "How many hearts does an octopus have?", options: ["1", "2", "3", "4"], answer: 2 },
    { q: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], answer: 2 },
    { q: "What year was the iPhone first released?", options: ["2005", "2006", "2007", "2008"], answer: 2 },
    { q: "Which country has the most natural lakes?", options: ["USA", "Russia", "Canada", "Brazil"], answer: 2 },
    { q: "What is the smallest country in the world?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], answer: 1 },
    { q: "How many bones does an adult human have?", options: ["186", "206", "226", "246"], answer: 1 },
    { q: "What is the fastest land animal?", options: ["Lion", "Cheetah", "Leopard", "Gazelle"], answer: 1 },
    { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Mercury"], answer: 1 },
    { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], answer: 2 },
    { q: "How many continents are there?", options: ["5", "6", "7", "8"], answer: 2 },
    { q: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Platinum"], answer: 2 },
    { q: "Who painted the Mona Lisa?", options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Picasso"], answer: 1 },
    { q: "What is the capital of Japan?", options: ["Osaka", "Tokyo", "Kyoto", "Hiroshima"], answer: 1 },
    { q: "How many players are on a football (soccer) team?", options: ["9", "10", "11", "12"], answer: 2 },
    { q: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: 2 },
    { q: "What is the tallest mountain in the world?", options: ["K2", "Mt. Everest", "Kangchenjunga", "Makalu"], answer: 1 },
    { q: "Which animal is known as the King of the Jungle?", options: ["Tiger", "Lion", "Elephant", "Gorilla"], answer: 1 },
    { q: "What is the main language spoken in Brazil?", options: ["Spanish", "Portuguese", "French", "English"], answer: 1 },
    { q: "How many legs does a spider have?", options: ["6", "8", "10", "12"], answer: 1 },
    { q: "What is the largest desert in the world?", options: ["Sahara", "Arabian", "Gobi", "Antarctic"], answer: 3 },
    { q: "What element does 'O' represent on the periodic table?", options: ["Osmium", "Oxygen", "Oganesson", "Olivine"], answer: 1 },
    { q: "In which year did World War II end?", options: ["1943", "1944", "1945", "1946"], answer: 2 },
    { q: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "600,000 km/s", "100,000 km/s"], answer: 0 },
    { q: "Which social media platform has a bird as its old logo?", options: ["Facebook", "Instagram", "Twitter", "Snapchat"], answer: 2 },
    { q: "What is the currency of the United Kingdom?", options: ["Euro", "Dollar", "Pound Sterling", "Franc"], answer: 2 },
    { q: "Which organ pumps blood through the body?", options: ["Lungs", "Brain", "Heart", "Liver"], answer: 2 },
    { q: "What is the national animal of Australia?", options: ["Koala", "Kangaroo", "Platypus", "Emu"], answer: 1 },
    { q: "How many seconds are in one hour?", options: ["360", "3,600", "36,000", "600"], answer: 1 },
    { q: "What fruit is known as the 'King of Fruits'?", options: ["Mango", "Durian", "Pineapple", "Jackfruit"], answer: 1 }
];

export const trivia = async (sock, m, args) => {
    const t = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];

    const optionLabels = ["A", "B", "C", "D"];
    const optionsText = t.options.map((opt, i) =>
        `${optionLabels[i]}. ${opt}`
    ).join("\n");

    return `╔══════════════════════════════════╗
║   🧠 *𝕋ℝ𝕀𝕍𝕀𝔸 𝕋𝕀𝕄𝔼* 🧠              ║
╚══════════════════════════════════╝

❓ *${t.q}*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${optionsText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ *Answer:* ||${optionLabels[t.answer]}. ${t.options[t.answer]}||

_How many did you get right?_ 🤔
_Send again for another question!_ 🔄`;
};
