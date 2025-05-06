import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { startState, finalState } = req.body;
    
    // Validate input
    if (!Array.isArray(startState) || !Array.isArray(finalState)) {
      return res.status(400).json({ 
        error: 'Both startState and finalState must be provided as arrays' 
      });
    }
    
    // Flattening 3D arrays into 1D arrays for command line arguments
    const flatStartState = startState.flat(2);  // Flatten the 3D array
    const flatFinalState = finalState.flat(2);  // Flatten the 3D array

    if (flatStartState.length !== 54 || flatFinalState.length !== 54) {
      return res.status(400).json({ 
        error: 'Start and final states must each contain exactly 54 values (6 faces x 3 rows x 3 columns)' 
      });
    }

    const tempDir = path.join(os.tmpdir(), 'rubix');
    const isWindows = os.platform() === 'win32';
    const executableName = `rubix${isWindows ? '.exe' : ''}`;
    const executablePath = path.join(tempDir, executableName);

    try {
      await fs.access(executablePath);
    } catch (error) {
      console.error('Executable not found:', error);
      return res.status(500).json({ 
        error: `Rubix engine not found at ${executablePath}. Please compile first.`,
        details: error.message
      });
    }

    // Combine start and final states into a single array of arguments
    const cmdArgs = [...flatStartState, ...flatFinalState].map(num => num.toString()).join(' ');
    const cmdLine = `"${executablePath}" ${cmdArgs}`;

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

