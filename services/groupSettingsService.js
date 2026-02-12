/**
 * Group Settings Storage - Manages per-group settings like welcome/goodbye messages
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const GROUP_SETTINGS_DIR = join(process.cwd(), "data", "groups");

// Ensure directory exists
if (!existsSync(GROUP_SETTINGS_DIR)) {
    mkdirSync(GROUP_SETTINGS_DIR, { recursive: true });
}

/**
 * Deep merge helper - merges nested objects instead of overwriting them
 */
function deepMerge(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        if (
            source[key] &&
            typeof source[key] === "object" &&
            !Array.isArray(source[key]) &&
            target[key] &&
            typeof target[key] === "object" &&
            !Array.isArray(target[key])
        ) {
            result[key] = deepMerge(target[key], source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

/**
 * Get settings file path for a group
 */
function getSettingsPath(groupJid) {
    const safeId = groupJid.replace(/[^a-zA-Z0-9]/g, "_");
    return join(GROUP_SETTINGS_DIR, `${safeId}.json`);
}

/**
 * Default group settings
 */
const DEFAULT_GROUP_SETTINGS = {
    welcome: {
        enabled: false,
        message: `╔══════════════════════════════════╗
║  🎉 *𝕎𝔼𝕃ℂ𝕆𝕄𝔼* 🎉  ║
╚══════════════════════════════════╝

Hey @user! 👋

Welcome to *{group}*!
You are member *#{count}*.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📜 Please read the group rules
💬 Introduce yourself
🎉 Enjoy your stay!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    },
    goodbye: {
        enabled: false,
        message: `╔══════════════════════════════════╗
║  👋 *𝔾𝕆𝕆𝔻𝔹𝕐𝔼* 👋  ║
╚══════════════════════════════════╝

@user has left the group.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
We hope to see you again! 💫
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    },
    antilink: {
        enabled: false,
        action: "warn" // warn, kick, delete
    },
    antispam: {
        enabled: false,
        maxMessages: 5,
        timeWindow: 10 // seconds
    },
    groupAntiDelete: {
        enabled: false
    }
};

/**
 * Load settings for a group
 */
export function loadGroupSettings(groupJid) {
    try {
        const path = getSettingsPath(groupJid);
        if (existsSync(path)) {
            const data = readFileSync(path, "utf-8");
            const saved = JSON.parse(data);
            return deepMerge(DEFAULT_GROUP_SETTINGS, saved);
        }
    } catch (err) {
        console.error(`❌ Failed to load group settings for ${groupJid}:`, err.message);
    }
    return deepMerge({}, DEFAULT_GROUP_SETTINGS);
}

/**
 * Save settings for a group
 */
export function saveGroupSettings(groupJid, settings) {
    try {
        const path = getSettingsPath(groupJid);
        writeFileSync(path, JSON.stringify(settings, null, 2), "utf-8");
        return true;
    } catch (err) {
        console.error(`❌ Failed to save group settings for ${groupJid}:`, err.message);
        return false;
    }
}

/**
 * Update specific group settings
 */
export function updateGroupSettings(groupJid, updates) {
    const settings = loadGroupSettings(groupJid);
    const newSettings = deepMerge(settings, updates);
    return saveGroupSettings(groupJid, newSettings);
}

/**
 * Get welcome message for a group
 */
export function getWelcomeMessage(groupJid) {
    const settings = loadGroupSettings(groupJid);
    return settings.welcome;
}

/**
 * Get goodbye message for a group
 */
export function getGoodbyeMessage(groupJid) {
    const settings = loadGroupSettings(groupJid);
    return settings.goodbye;
}

/**
 * Save invite code for a group
 */
export function saveInviteCode(groupJid, code) {
    const settings = loadGroupSettings(groupJid);
    settings.inviteCode = code;
    settings.lastKnownName = settings.lastKnownName || "Unknown Group"; // Should be updated separately if possible
    settings.leftAt = new Date().toISOString();
    return saveGroupSettings(groupJid, settings);
}

/**
 * Get invite code for a group
 */
export function getInviteCode(groupJid) {
    const settings = loadGroupSettings(groupJid);
    return settings.inviteCode;
}

/**
 * Update last known group name
 */
export function updateGroupName(groupJid, name) {
    const settings = loadGroupSettings(groupJid);
    settings.lastKnownName = name;
    return saveGroupSettings(groupJid, settings);
}

/**
 * List all groups with saved invite codes
 */
export function getGroupsWithInviteCodes() {
    // This would require listing all files in the directory
    // For now, we'll implement this later if needed for a full list command
    return [];
}
