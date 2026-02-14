import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const creator = async (sock, m, args) => {
    // Load creator photo
    let creatorBuffer = null;
    try {
        const creatorPath = join(process.cwd(), "assets", "creator.jpeg");
        if (existsSync(creatorPath)) {
            creatorBuffer = readFileSync(creatorPath);
        }
    } catch (e) {
        console.error("❌ Failed to load creator image:", e.message);
    }

    const caption = `╔══════════════════════════════════╗
║   💎 *𝔹𝕆𝕋 ℂℝ𝔼𝔸𝕋𝕆ℝ* 💎            ║
╚══════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *ℙ𝔼ℝ𝕊𝕆ℕ𝔸𝕃 𝕀ℕ𝔽𝕆*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• *Name:* Nyaganya Malima Nyaganya
• *Title:* Fullstack AI Engineer
• *Company:* Founder of Tervux
• *Age:* 21
• *Gender:* Male
• *Country:* Tanzania
• *City:* Dar es Salaam
• *Marital Status:* Single
• *Religion:* Christian
• *Nationality:* Tanzanian
• *Language:* English & Swahili
• *Phone:* +255 785 046 741
• *Email:* nyaganyamalima47@gmail.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 *𝔸𝔹𝕆𝕌𝕋*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Passionate fullstack developer specializing
in AI-powered applications and modern web
technologies. Building scalable digital
products that solve real-world problems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 *𝕃𝕀ℕ𝕂𝕊*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• 🌐 *Portfolio:* nyaganya.tervux.com
• 🐙 *GitHub:* github.com/JonniTech
• 🏢 *Company:* www.tervux.com
• 📱 *WhatsApp:* wa.me/255785046741

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 *𝕊𝔼ℝ𝕍𝕀ℂ𝔼𝕊*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Secure REST APIs & Authentication
• Dashboards & Admin Panels
• Web Apps & Landing Pages
• AI Chatbots & Voice Agents
• Bug Fixes & Feature Development

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ _"I build products before I finish_
_learning the technology – learning_
_by doing is my superpower!"_

╔══════════════════════════════════╗
║    💠 *ℙ𝕠𝕨𝕖𝕣𝕖𝕕 𝕓𝕪 𝕋𝔼ℝ𝕍𝕌𝕏* 💠    ║
╚══════════════════════════════════╝`;

    if (creatorBuffer) {
        return { image: creatorBuffer, caption, linkPreview: null };
    }
    return caption;
};
