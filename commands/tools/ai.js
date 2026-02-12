import OpenAI from "openai";

const client = new OpenAI({
    apiKey: "4e9fb363e4f2431cab69e20da6ac7047.PVKzsV6Vz9wjDiRZ",
    baseURL: "https://api.z.ai/api/paas/v4/"
});

export const ai = async (sock, m, args) => {
    const chatJid = m.key.remoteJid;
    const question = args.join(" ");

    if (!question) {
        return `╔══════════════════════════════════╗
║   🤖 *𝕋𝔼ℝ𝕍𝕌𝕏 𝔸𝕀* 🤖                ║
╚══════════════════════════════════╝

*Usage:* !ai <your question>

*Examples:*
• *!ai* What is the meaning of life?
• *!ai* Write a poem about love
• *!ai* Explain quantum physics simply
• *!ai* Help me with my homework

🧠 _Powered by Tervux AI_ ⚡`;
    }

    // Send typing indicator
    await sock.sendMessage(chatJid, {
        text: "🤖 _Thinking..._"
    });

    try {
        const completion = await client.chat.completions.create({
            model: "glm-4.6-flash",
            messages: [
                {
                    role: "system",
                    content: `You are Tervux AI, a helpful, friendly, and intelligent AI assistant built into a WhatsApp bot. You are created by Nyaganya Malima Nyaganya (aka Tervux). You answer questions clearly and concisely. Keep responses under 2000 characters for WhatsApp readability. Use emojis occasionally to be engaging. If asked about yourself, mention you are Tervux AI powered by advanced language models.`
                },
                {
                    role: "user",
                    content: question
                }
            ]
        });

        const reply = completion.choices[0]?.message?.content;

        if (!reply) {
            return `❌ *AI returned no response.* Try again!`;
        }

        // Trim if extremely long
        const trimmed = reply.length > 3000
            ? reply.substring(0, 3000) + "\n\n_...response trimmed for WhatsApp_ ✂️"
            : reply;

        return `╔══════════════════════════════════╗
║   🤖 *𝕋𝔼ℝ𝕍𝕌𝕏 𝔸𝕀* 🤖                ║
╚══════════════════════════════════╝

❓ *You asked:* ${question}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${trimmed}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 _Powered by Tervux AI_ ⚡`;

    } catch (err) {
        console.error("❌ AI Error:", err.message);

        if (err.message?.includes("timeout") || err.code === "ETIMEDOUT") {
            return `⏱️ *AI took too long to respond.* Try again with a simpler question!`;
        }

        return `❌ *AI Error:* ${err.message || "Something went wrong"}

💡 _Try again in a moment._`;
    }
};
