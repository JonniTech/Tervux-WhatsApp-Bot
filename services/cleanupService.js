import { readdirSync, statSync, rmSync, existsSync } from "fs";
import { join } from "path";

/**
 * Sweeps the sessions directory for folders older than 24 hours.
 * usage: cleanStaleSessions();
 */
export const cleanStaleSessions = () => {
    const sessionsDir = join(process.cwd(), "sessions");
    if (!existsSync(sessionsDir)) return;

    console.log("🧹 [Maintenance] Scanning for stale session files...");

    try {
        const files = readdirSync(sessionsDir);
        let deletedCount = 0;

        files.forEach((file) => {
            // Only touch Tervux-XXXX folders
            if (!file.startsWith("Tervux-")) return;

            const filePath = join(sessionsDir, file);
            try {
                const stats = statSync(filePath);
                const now = Date.now();
                const age = now - stats.mtimeMs; // Age in milliseconds
                const ONE_DAY = 24 * 60 * 60 * 1000;

                if (age > ONE_DAY) {
                    rmSync(filePath, { recursive: true, force: true });
                    deletedCount++;
                    console.log(`   Deleted stale session: ${file} (${(age / 3600000).toFixed(1)}h old)`);
                }
            } catch (err) {
                console.error(`   Failed to check/delete ${file}:`, err.message);
            }
        });

        if (deletedCount > 0) {
            console.log(`✅ [Maintenance] Cleaned up ${deletedCount} stale session(s).`);
        } else {
            console.log("✅ [Maintenance] No stale sessions found.");
        }
    } catch (error) {
        console.error("❌ [Maintenance] Cleanup failed:", error.message);
    }
};
