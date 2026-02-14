/**
 * Convert Markdown text to WhatsApp compatible formatting
 * 
 * Rules:
 * - **bold** or __bold__ -> *bold*
 * - *italic* or _italic_ -> _italic_
 * - `code` -> `code` (unchanged)
 * - ```codeblock``` -> ```codeblock``` (unchanged)
 * - [text](url) -> text (url)
 * - headers -> *header*
 */

export const formatMarkdown = (text) => {
    if (!text) return text;

    let formatted = text;

    // 1. Code Blocks (preserve them by temporarily replacing with placeholders)
    const codeBlocks = [];
    formatted = formatted.replace(/```[\s\S]*?```/g, (match) => {
        codeBlocks.push(match);
        return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
    });

    // 2. Inline Code (preserve them by temporarily replacing with placeholders)
    const inlineCode = [];
    formatted = formatted.replace(/`[^`]+`/g, (match) => {
        inlineCode.push(match);
        return `__INLINE_CODE_${inlineCode.length - 1}__`;
    });

    // 3. Headers (### Header -> *Header*)
    formatted = formatted.replace(/^#{1,6}\s+(.+)$/gm, '*$1*');

    // 4. Bold (**text** or __text__ -> *text*)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '*$1*');
    formatted = formatted.replace(/__(.*?)__/g, '*$1*');

    // 5. Italic (*text* or _text_ -> _text_)
    // Note: We need to be careful not to mess up the * we just added for bold.
    // But since we use * for bold in WA, and _ for italic, we can just map *text* to _text_ 
    // IF it was originally *text* (italic) and not **text** (bold converted to *text*).
    // However, simplest compatible way for WA is _text_ for italics.
    // The previous step converted **bold** to *bold*. 
    // The regex `/(?<!\*)\*(?![*\s])(.+?)(?<!\s)\*(?!\*)/g` is tricky.
    // Let's stick to standard markdown to WA mapping:
    // MD *italic* -> WA _italic_
    // MD _italic_ -> WA _italic_
    // MD **bold** -> WA *bold*

    // To avoid conflict, let's process distinct patterns.
    // If we already converted ** -> *, those * are now ambiguous. 
    // BETTER APPROACH: Use a tokenizer or specific order.

    // Let's restart the body logic with a safer approach for Bold/Italic overlap.

    // Reset to raw input (excluding code blocks) to do it cleanly.
    formatted = text;

    // 1. Extract Code Blocks
    const blocks = [];
    formatted = formatted.replace(/```[\s\S]*?```/g, (match) => {
        blocks.push(match);
        return `💻BLOCK${blocks.length - 1}💻`;
    });

    const inlines = [];
    formatted = formatted.replace(/`[^`\n]+`/g, (match) => {
        inlines.push(match);
        return `💻INLINE${inlines.length - 1}💻`;
    });

    // 2. Headers -> Bold
    formatted = formatted.replace(/^#{1,6}\s+(.+)$/gm, '*$1*');

    // 3. Bold (**text**) -> *text*
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '*$1*');
    formatted = formatted.replace(/__([^_]+)__/g, '*$1*');

    // 4. Italic (*text*) -> _text_
    // We match *text* but NOT **text** (which we already handled, or is double star).
    // Since we ALREADY converted ** to *, we now have *bold* and *italic* (from source *).
    // Wait, WA uses *bold* and _italic_.
    // MD uses **bold** and *italic*.
    // So if we see *, it might be the * we just made (bold) or original * (italic).
    // Conflict! 
    // FIX: Convert **First** -> TEMPORARY_BOLD -> *Final*

    // RE-DO strategy:
    formatted = text; // Start fresh again

    // Protect Code
    const allCode = [];
    formatted = formatted.replace(/(`{1,3})[\s\S]*?\1/g, (match) => {
        allCode.push(match);
        return `££CODE${allCode.length - 1}££`;
    });

    // Headers -> Bold
    formatted = formatted.replace(/^#{1,6}\s+(.+)$/gm, '*$1*');

    // Bold (** or __) -> *
    formatted = formatted.replace(/(\*\*|__)(.*?)\1/g, '*$2*');

    // Italic (* or _) -> _
    // Note: If original text had `*italic*`, it should become `_italic_`.
    // But we just turned `**bold**` into `*bold*`.
    // We need to distinguish.
    // Let's use a placeholder for the bold conversion.

    // FINAL ROBUST STRATEGY:
    formatted = text;
    const protectedCode = [];
    formatted = formatted.replace(/(`{1,3})[\s\S]*?\1/g, (match) => {
        protectedCode.push(match);
        return `££CODE${protectedCode.length - 1}££`;
    });

    // Headers: # Header -> *Header* (Bold)
    // We use the bold placeholder to ensure it doesn't get turned into italics later
    formatted = formatted.replace(/^#{1,6}\s+(.+)$/gm, '§§B$1§§B');

    // Bold: **text** -> *text*
    // Use a unique placeholder for the * to avoid confusing it with italic *
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '§§B$1§§B');
    formatted = formatted.replace(/__([^_]+)__/g, '§§B$1§§B');

    // Italics: *text* or _text_ -> _text_
    // Match *text* that isn't part of a placeholder
    formatted = formatted.replace(/\*([^*]+)\*/g, '_$1_');
    formatted = formatted.replace(/_([^_]+)_/g, '_$1_');

    // Restore Bold placeholders -> *text*
    formatted = formatted.replace(/§§B(.*?)§§B/g, '*$1*');

    // Links: [Text](URL) -> Text (URL)
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');

    // Lists: 
    // - item -> • item
    // * item -> • item
    formatted = formatted.replace(/^[\*\-]\s+(.+)$/gm, '• $1');

    // Restore Code
    formatted = formatted.replace(/££CODE(\d+)££/g, (match, index) => {
        return allCode[index];
    });

    return formatted;
};
