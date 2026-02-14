import axios from "axios";
import { getCachedConfig } from "../../services/configService.js";

export const sport = async (sock, m, args) => {
    const config = getCachedConfig();
    const p = config.prefix || "!";
    const team = args.join(" ");
    if (!team) {
        return `╔══════════════════════════════════╗
║     ⚽ *𝕋𝔼ℝ𝕍𝕌𝕏 𝕊ℙ𝕆ℝ𝕋𝕊* ⚽        ║
╚══════════════════════════════════╝

📝 *𝕌𝕤𝕒𝕘𝕖:* ${p}sport [team]
📌 *𝔼𝕩𝕒𝕞𝕡𝕝𝕖:* ${p}sport Manchester United

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Search any sports team worldwide! 🏆`;
    }

    try {
        console.log(`⚽ Searching for team: ${team}`);

        // TheSportsDB public API search
        const url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(team)}`;
        const { data } = await axios.get(url, { timeout: 15000 });

        if (!data || !data.teams || data.teams.length === 0) {
            return `╔══════════════════════════════════╗
║       ❌ *ℕ𝕆𝕋 𝔽𝕆𝕌ℕ𝔻* ❌          ║
╚══════════════════════════════════╝

Team "${team}" not found.

💡 *Tip:* Try full name like:
• "Manchester United" not "MU"
• "Real Madrid" not "RM"`;
        }

        const t = data.teams[0];
        const description = t.strDescriptionEN
            ? t.strDescriptionEN.substring(0, 400) + "..."
            : "No description available.";

        const message = `╔══════════════════════════════════╗
║      ⚽ *𝕋𝔼𝔸𝕄 𝕀ℕ𝔽𝕆* ⚽           ║
╚══════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *𝔻𝔼𝕋𝔸𝕀𝕃𝕊*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 *𝕋𝕖𝕒𝕞:* ${t.strTeam}
🏟️ *𝕊𝕥𝕒𝕕𝕚𝕦𝕞:* ${t.strStadium || "N/A"}
🏆 *𝕃𝕖𝕒𝕘𝕦𝕖:* ${t.strLeague}
🌍 *ℂ𝕠𝕦𝕟𝕥𝕣𝕪:* ${t.strCountry}
📅 *𝔽𝕠𝕦𝕟𝕕𝕖𝕕:* ${t.intFormedYear}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 *𝔸𝔹𝕆𝕌𝕋*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${description}`;

        // Download badge to buffer
        if (t.strTeamBadge) {
            try {
                const badgeRes = await axios.get(t.strTeamBadge, { responseType: 'arraybuffer', timeout: 10000 });
                return {
                    image: Buffer.from(badgeRes.data),
                    caption: message
                };
            } catch (imgErr) {
                console.warn("Failed to download sport badge:", imgErr.message);
                return message;
            }
        }

        return message;

    } catch (err) {
        console.error("Sport error:", err.message);
        return `╔══════════════════════════════════╗
║         ❌ *𝔼ℝℝ𝕆ℝ* ❌            ║
╚══════════════════════════════════╝

Failed to fetch sports details.
The service might be down.`;
    }
};
