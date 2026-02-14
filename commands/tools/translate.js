import axios from "axios";
import { getCachedConfig } from "../../services/configService.js";

export const translate = async (sock, m, args) => {
    let targetLang = "en";
    let textToTranslate;

    if (args[0] && args[0].startsWith("--")) {
        targetLang = args[0].replace("--", "");
        textToTranslate = args.slice(1).join(" ");
    } else {
        textToTranslate = args.join(" ");
    }

    const contextInfo = m.message?.extendedTextMessage?.contextInfo || m.message?.imageMessage?.contextInfo || m.message?.videoMessage?.contextInfo;
    const quoted = contextInfo?.quotedMessage;

    if (!textToTranslate && quoted) {
        textToTranslate = quoted.conversation || quoted.extendedTextMessage?.text || quoted.imageMessage?.caption || quoted.videoMessage?.caption;
    }

    const config = getCachedConfig();
    const p = config.prefix || "!";

    if (!textToTranslate) {
        return `╔══════════════════════════════════╗
║   🌐 *𝕋𝔼ℝ𝕏𝕌𝕏 𝕋ℝ𝔸ℕ𝕊𝕃𝔸𝕋𝕆ℝ* 🌐    ║
╚══════════════════════════════════╝

📝 *𝕌𝕤𝕒𝕘𝕖:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• *${p}translate* [text]
• *${p}translate --fr* Hello
• Reply to a message with *${p}translate*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *𝕃𝕒𝕟𝕘𝕦𝕒𝕘𝕖 ℂ𝕠𝕕𝕖𝕤:*
en=English, fr=French, es=Spanish
de=German, sw=Swahili, zh=Chinese`;
    }

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`;
        const { data } = await axios.get(url);

        if (!data || !data[0]) throw new Error("Invalid response");

        const translatedText = data[0].map(item => item[0]).filter(Boolean).join("");
        const detectedLang = data[2] || "auto";

        return `╔══════════════════════════════════╗
║   🌐 *𝕋𝔼ℝ𝕍𝕌𝕏 𝕋ℝ𝔸ℕ𝕊𝕃𝔸𝕋𝕆ℝ* 🌐    ║
╚══════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📥 *𝕆ℝ𝕀𝔾𝕀ℕ𝔸𝕃* (${detectedLang})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${textToTranslate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 *𝕋ℝ𝔸ℕ𝕊𝕃𝔸𝕋𝔼𝔻* (${targetLang})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${translatedText}`;
    } catch (err) {
        console.error("Translation error:", err.message);
        return `╔══════════════════════════════════╗
║         ❌ *𝔼ℝℝ𝕆ℝ* ❌            ║
╚══════════════════════════════════╝

Translation failed!
Service temporarily unavailable.`;
    }
};
