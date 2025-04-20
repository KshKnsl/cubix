import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { board } = req.body;
    if (!Array.isArray(board) || board.length !== 16) {
      return res.status(400).json({ error: 'Board must contain exactly 16 numbers' });
    }

    const tempDir = path.join(os.tmpdir(), 'cubix-slider'); // Correct directory for Number Slider
    const executablePath = path.join(tempDir, 'number_slider_engine.exe');
    const altExecutablePath = path.join(tempDir, 'number_slider_engine.exe'); // Alternative path

    let targetExecutable = executablePath;

    try {
      await fs.access(executablePath);
    } catch (error) {
      try {
        await fs.access(altExecutablePath);
        targetExecutable = altExecutablePath;
      } catch (error) {
        console.error('No executable found:', error);
        return res.status(500).json({ error: 'Number Slider engine not found. Please compile first.' });
      }
    }

    const cmdArgs = board.map((num) => num.toString()).join(' ');
    const cmdLine = `"${targetExecutable}" ${cmdArgs}`;

    console.log('Executing command:', cmdLine);

    const output = await new Promise((resolve, reject) => {
      exec(cmdLine, { timeout: 10000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) {
          reject(stderr || error.message);
          return;
        }
        resolve(stdout);
      });
    });

    res.status(200).json({ output: output.trim() });
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({ error: error.message });
  }
}
