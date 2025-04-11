import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const enginePath = path.join(process.cwd(), 'cpp', 'sudoku_engine.cpp');
        const tempDir = path.join(os.tmpdir(), 'cubix-sudoku');
        const executablePath = path.join(tempDir, 'sudoku_engine.exe');

        // Create temp directory if it doesn't exist
        try {
            await fs.mkdir(tempDir, { recursive: true });
        } catch (error) {
            console.error('Failed to create temp directory:', error);
        }

        // Check if source file exists
        try {
            await fs.access(enginePath);
        } catch (error) {
            return res.status(500).json({ 
                error: 'Source file not found',
                details: `Could not find ${enginePath}`
            });
        }

        // Try to remove existing executable if it exists
        try {
            await fs.unlink(executablePath);
        } catch (error) {
            // Ignore error if file doesn't exist
            if (error.code !== 'ENOENT') {
                console.error('Failed to remove existing executable:', error);
            }
        }

        // Compile the C++ engine with detailed error output
        await new Promise((resolve, reject) => {
            const cmd = `g++ "${enginePath}" -o "${executablePath}"`;
            exec(cmd, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
                if (error || stderr) {
                    reject({
                        error: error?.message || 'Compilation failed',
                        stderr: stderr,
                        stdout: stdout,
                        command: cmd
                    });
                } else {
                    resolve(stdout);
                }
            });
        });

        // Verify executable was created
        try {
            await fs.access(executablePath);
        } catch (error) {
            return res.status(500).json({ 
                error: 'Compilation failed',
                details: `Executable not created at ${executablePath}`
            });
        }

        // Update file permissions to ensure it's executable
        try {
            await fs.chmod(executablePath, 0o755);
        } catch (error) {
            console.error('Failed to set executable permissions:', error);
        }

        res.status(200).json({ 
            success: true, 
            message: 'Engine compiled successfully',
            executablePath
        });
    } catch (error) {
        console.error('Compilation error:', error);
        res.status(500).json({ 
            error: 'Compilation failed',
            details: error.stderr || error.message,
            command: error.command
        });
    }
}
