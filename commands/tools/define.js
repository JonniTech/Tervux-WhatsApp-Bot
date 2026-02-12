import axios from "axios";

export const define = async (sock, m, args) => {
    const word = args[0]?.toLowerCase();

    if (!word) {
        return `╔══════════════════════════════════╗
║   📖 *𝔻𝕀ℂ𝕋𝕀𝕆ℕ𝔸ℝ𝕐* 📖              ║
╚══════════════════════════════════╝

*Usage:* !define <word>
*Example:* !define serendipity`;
    }

    try {
        const { data } = await axios.get(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
            { timeout: 10000 }
        );

        const entry = data[0];
        const phonetic = entry.phonetics?.find(p => p.text)?.text || "";

        let result = `╔══════════════════════════════════╗
║   📖 *𝔻𝕀ℂ𝕋𝕀𝕆ℕ𝔸ℝ𝕐* 📖              ║
╚══════════════════════════════════╝

📝 *Word:* ${entry.word}
${phonetic ? `🔊 *Phonetic:* ${phonetic}\n` : ""}`;

        // Show up to 3 meanings
        const meanings = entry.meanings.slice(0, 3);
        for (const meaning of meanings) {
            result += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            result += `📌 *${meaning.partOfSpeech.toUpperCase()}*\n`;

            const defs = meaning.definitions.slice(0, 2);
            defs.forEach((def, i) => {
                result += `\n${i + 1}. ${def.definition}`;
                if (def.example) {
                    result += `\n   _"${def.example}"_`;
                }
            });

            if (meaning.synonyms?.length > 0) {
                result += `\n\n🔗 *Synonyms:* ${meaning.synonyms.slice(0, 5).join(", ")}`;
            }
        }

        return result;
    } catch (err) {
        if (err.response?.status === 404) {
            return `╔══════════════════════════════════╗
║   📖 *𝔻𝕀ℂ𝕋𝕀𝕆ℕ𝔸ℝ𝕐* 📖              ║
╚══════════════════════════════════╝

❌ Word "*${word}*" not found.

💡 _Check spelling and try again._`;
        }

        return `❌ Dictionary lookup failed: ${err.message}`;
    }
};
