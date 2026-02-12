export const password = async (sock, m, args) => {
    const length = Math.min(Math.max(parseInt(args[0]) || 16, 8), 64);
    const includeSpecial = args[1] !== "simple";

    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = lowercase + uppercase + numbers;
    if (includeSpecial) chars += special;

    // Ensure at least one of each type
    let pass = "";
    pass += lowercase[Math.floor(Math.random() * lowercase.length)];
    pass += uppercase[Math.floor(Math.random() * uppercase.length)];
    pass += numbers[Math.floor(Math.random() * numbers.length)];
    if (includeSpecial) pass += special[Math.floor(Math.random() * special.length)];

    // Fill the rest
    for (let i = pass.length; i < length; i++) {
        pass += chars[Math.floor(Math.random() * chars.length)];
    }

    // Shuffle
    pass = pass.split("").sort(() => Math.random() - 0.5).join("");

    const strength = length >= 20 ? "🟢 *VERY STRONG*" :
        length >= 16 ? "🟢 *STRONG*" :
            length >= 12 ? "🟡 *GOOD*" :
                "🟠 *MODERATE*";

    return `╔══════════════════════════════════╗
║   🔐 *ℙ𝔸𝕊𝕊𝕎𝕆ℝ𝔻 𝔾𝔼ℕ* 🔐           ║
╚══════════════════════════════════╝

🔑 *Your Password:*
\`\`\`${pass}\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📏 *Length:* ${length} characters
🔤 *Type:* ${includeSpecial ? "Complex (letters + numbers + symbols)" : "Simple (letters + numbers)"}
💪 *Strength:* ${strength}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *Usage:*
• *!password* → 16 chars (default)
• *!password 24* → 24 chars
• *!password 12 simple* → No symbols

⚠️ _Save this somewhere safe!_`;
};
