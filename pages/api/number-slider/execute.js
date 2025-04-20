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

    const tempDir = path.join(os.tmpdir(), 'cubix-slider');
    const executablePath = path.join(tempDir, 'number_slider_engine'); // Do not include .exe here

    try {
      await fs.access(`${executablePath}.exe`); // Check for the executable with .exe extension
    } catch (error) {
      console.error('Executable not found:', error);
      return res.status(500).json({ error: 'Number Slider engine not found. Please compile first.' });
    }

    const cmdArgs = board.map((num) => num.toString()).join(' ');
    const cmdLine = `"${executablePath}.exe" ${cmdArgs}`; // Append .exe only when constructing the command

    console.log('Executing command:', cmdLine);

    const output = await new Promise((resolve, reject) => {
      exec(cmdLine, { shell: true, timeout: 10000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) {
          console.error('Execution error:', error);
          console.error('Stderr:', stderr);
          reject(stderr || error.message);
          return;
        }
        console.log('Execution stdout:', stdout);
        resolve(stdout);
      });
    });

    res.status(200).json({ output: output.trim() });
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: error.message });
  }
}
