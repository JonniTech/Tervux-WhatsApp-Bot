import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { randomBytes } from 'crypto';

/**
 * Downloads YouTube media using the local bin/yt-dlp binary.
 * @param {string} url - YouTube URL
 * @param {string} type - 'audio' or 'video'
 * @returns {Promise<Buffer>} - Media buffer
 */
export const downloadYT = async (url, type = 'audio') => {
    return new Promise((resolve, reject) => {
        const tempFile = path.join(os.tmpdir(), `ytdl_${randomBytes(6).toString('hex')}.${type === 'audio' ? 'mp3' : 'mp4'}`);

        const args = type === 'audio'
            ? ['-f', 'bestaudio', '--extract-audio', '--audio-format', 'mp3', '-o', tempFile, url]
            : ['-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best', '-o', tempFile, url];

        const ytDlpPath = path.resolve('./bin/yt-dlp');
        const child = spawn(ytDlpPath, args);

        let errorData = '';

        child.stderr.on('data', (data) => {
            errorData += data.toString();
        });

        child.on('close', async (code) => {
            if (code === 0) {
                try {
                    const buffer = fs.readFileSync(tempFile);
                    fs.unlinkSync(tempFile); // Cleanup
                    resolve(buffer);
                } catch (readErr) {
                    reject(new Error(`Failed to read downloaded file: ${readErr.message}`));
                }
            } else {
                if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
                reject(new Error(`yt-dlp failed with code ${code}: ${errorData}`));
            }
        });
    });
};
