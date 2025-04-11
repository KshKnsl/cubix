import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

async function compileEngine() {
    const enginePath = path.join(process.cwd(), 'cpp', 'sudoku_engine.cpp');
    const tempDir = path.join(os.tmpdir(), 'cubix-sudoku');
    const executablePath = path.join(tempDir, 'sudoku_engine.exe');

    console.log('Compiling engine:', {
        enginePath,
        tempDir,
        executablePath
    });

    // Create temp directory if it doesn't exist
    await fs.mkdir(tempDir, { recursive: true });

    // Compile the C++ engine
    await new Promise((resolve, reject) => {
        const cmd = `g++ "${enginePath}" -o "${executablePath}"`;
        console.log('Running compile command:', cmd);
        
        exec(cmd, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
            if (error || stderr) {
                console.error('Compilation failed:', {
                    error: error?.message,
                    stderr,
                    stdout
                });
                reject(new Error(stderr || error?.message));
            } else {
                console.log('Compilation succeeded');
                resolve(stdout);
            }
        });
    });

    // Verify and set permissions
    await fs.chmod(executablePath, 0o755);
    console.log('Set executable permissions');
    
    // Verify the file exists and is executable
    const stats = await fs.stat(executablePath);
    console.log('Executable stats:', {
        size: stats.size,
        mode: stats.mode.toString(8),
        created: stats.birthtime
    });
    
    return executablePath;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { args } = req.body;
    if (!args) {
        return res.status(400).json({ error: 'Missing args parameter' });
    }

    try {
        const executablePath = path.join(os.tmpdir(), 'cubix-sudoku', 'sudoku_engine.exe');
        
        // Check if executable exists and is valid
        let needsRecompile = true;
        try {
            const stats = await fs.stat(executablePath);
            if (stats.size > 0) {
                console.log('Found existing executable:', {
                    size: stats.size,
                    mode: stats.mode.toString(8),
                    created: stats.birthtime
                });
                needsRecompile = false;
            } else {
                console.log('Executable exists but is empty');
            }
        } catch (error) {
            console.log('Executable not found:', error.message);
        }

        if (needsRecompile) {
            console.log('Recompiling engine...');
            await compileEngine();
            console.log('Recompilation complete');
        }
        
        // Execute the engine with provided arguments
        console.log('Executing command with args:', args);
        const output = await new Promise((resolve, reject) => {
            const cmd = `"${executablePath}" ${args.join(' ')}`;
            console.log('Running command:', cmd);
            
            exec(cmd, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
                if (error || stderr) {
                    console.error('Execution failed:', {
                        error: error?.message,
                        stderr,
                        stdout
                    });
                    reject({
                        error: error?.message || 'Execution failed',
                        stderr: stderr,
                        stdout: stdout
                    });
                } else {
                    try {
                        // Parse the output as JSON
                        const result = JSON.parse(stdout);
                        resolve(result);
                    } catch (e) {
                        // If not JSON, return as raw output
                        resolve({ output: stdout.trim() });
                    }
                }
            });
        });

        res.status(200).json(output);
    } catch (error) {
        console.error('Execution error:', error);
        res.status(500).json({ 
            error: 'Execution failed',
            details: error.stderr || error.message
        });
    }
}
