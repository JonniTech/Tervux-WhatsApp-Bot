/**
 * Helper: Get group metadata (cached if possible, but for now direct)
 */
export async function getGroupMetadata(sock, groupJid) {
    try {
        // console.log(`📡 [GroupMetadata] Fetching for ${groupJid}...`);
        const metadata = await sock.groupMetadata(groupJid);
        if (!metadata) {
            console.error(`❌ [GroupMetadata] Received null/undefined for ${groupJid}`);
        }
        return metadata;
    } catch (e) {
        console.error(`❌ [GroupMetadata] Error fetching ${groupJid}:`, e.message);
        return null;
    }
}

/**
 * Helper: Check if user is group admin
 */
export async function isAdmin(sock, groupJid, userJid) {
    try {
        const metadata = await getGroupMetadata(sock, groupJid);
        if (!metadata) {
            console.error("❌ isAdmin: No metadata found for group", groupJid);
            return false;
        }

        // Get the list of admin IDs from participants
        const admins = metadata.participants
            .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
            .map(p => p.id);

        // Helper to normalize JIDs for comparison (strips device/version suffixes)
        const clean = (jid) => jid ? jid.split(":")[0].split("@")[0] : "";

        const targetClean = clean(userJid);

        // 1. Direct check: Is the target JID (phone or LID) in the admin list?
        if (admins.includes(userJid)) return true;

        // 2. Normalized check: Do the number/ID parts match?
        if (admins.some(a => clean(a) === targetClean)) return true;

        // 3. Bot-specific check (Bot often has different Phone vs LID JIDs)
        const botJid = sock.user?.id || "";
        const botLid = sock.user?.lid || "";

        if (clean(botJid) === targetClean || (botLid && clean(botLid) === targetClean)) {
            // Target is the bot. Check if bot's phone OR lid is in admin list.
            const isBotAdmin = admins.some(a => {
                const aClean = clean(a);
                return aClean === clean(botJid) || (botLid && aClean === clean(botLid));
            });
            if (isBotAdmin) return true;
        }

        // 4. Special LID matching for other users (if we have a way to resolve)
        // For now, these are the most common cases.

        return false;
    } catch (e) {
        console.error("❌ isAdmin Error:", e);
        return false;
    }
}

/**
 * Helper: Check if bot is group admin
 */
export async function isBotAdmin(sock, groupJid) {
    try {
        const botJid = sock.user?.id || "";
        if (!botJid) return false;

        return await isAdmin(sock, groupJid, botJid);
    } catch (e) {
        console.error("❌ isBotAdmin Error:", e);
        return false;
    }
}
