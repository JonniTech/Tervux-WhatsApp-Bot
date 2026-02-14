export const IMPRESSIVE_EMOJIS = [
    // Animals (Full Body)
    "🦁", "🐯", "🐺", "🦓", "🦍", "🐘", "🦏", "🦒", "🐆", "🦌", "🦘", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🐐", "🐪", "🐫", "🦙", "🦖", "🦕", "🐉", "🐋", "🐬", "🦈", "🐙", "🦀", "🦞", "🦐", "🦑", "🐌", "🦋", "🐛", "🐜", "🐝", "🐞", "🦗", "🕷️", "🦂", "🦎", "🐢", "🐍", "🦜", "🦢", "🦩", "🕊️", "🦅", "🦉", "🦆", "🐦",
    // Nature & Trees
    "🌲", "🌳", "🌴", "🌵", "🌿", "🍀", "🍁", "🍂", "🍃", "🍄", "🌸", "🌺", "🌻", "🌼", "🌷", "🌾", "🐚", "🌊", "🌋", "🏔️", "🏕️", "🏜️", "🏝️", "🌈",
    // Food & Fruit
    "🍓", "🍎", "🍉", "🍍", "🥑", "🍋", "🍒", "🍑", "🍇", "🥥", "🥝", "🌽", "🥕", "🍕", "🌮", "🍣", "🍱", "🥟", "🍩", "🍦", "🍭",
    // Space & Weather
    "🌍", "🌓", "🪐", "🌠", "🌌", "🛰️", "🚀", "🛸", "🌙", "⚡", "🔥", "❄️", "🧊", "🌪️", "🌊",
    // Objects & Symbols
    "💎", "🔮", "💡", "🛡️", "🧬", "🧪", "⚙️", "🔋", "💻", "📱", "📡", "🎬", "🎧", "🎮", "🎹", "🎸", "🎷", "🎺", "🎻", "🏆", "🥇", "⚽", "🏀", "🚗", "🏎️", "🚁", "⛵", "⚓", "🛰️"
];

/**
 * Returns a random emoji from the impressive list.
 */
export function getRandomEmoji() {
    return IMPRESSIVE_EMOJIS[Math.floor(Math.random() * IMPRESSIVE_EMOJIS.length)];
}

/**
 * Wraps the socket's sendMessage function to automatically react to outgoing messages.
 * @param {import("@whiskeysockets/baileys").WASocket} sock 
 */
export function addAutoReaction(sock) {
    const originalSendMessage = sock.sendMessage.bind(sock);

    sock.sendMessage = async (jid, content, options = {}) => {
        // Execute original sendMessage
        const result = await originalSendMessage(jid, content, options);

        // Skip reaction if:
        // 1. Sending a reaction itself (to avoid infinite recursion)
        // 2. Sending to status (baileys handles differently)
        // 3. Result message key is missing
        if (content.react || jid === "status@broadcast" || !result?.key) {
            return result;
        }

        // Auto-react with a slight delay for better UX
        setTimeout(async () => {
            try {
                await originalSendMessage(jid, {
                    react: { text: getRandomEmoji(), key: result.key }
                });
            } catch (err) {
                // Silently fail for reactions
            }
        }, 1000);

        return result;
    };
}
