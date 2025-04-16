const { exec } = require('child_process');
const path = require('path');
const fs = require('fs/promises');
const os = require('os');

async function compileEngine() {
  const platform = os.platform();
  const tempDir = path.join(os.tmpdir(), 'cubix-sudoku');
  const sourcePath = path.join(process.cwd(), 'cpp', 'sudoku_engine.cpp');
  
  // Create temp directory
  await fs.mkdir(tempDir, { recursive: true });

  // Platform-specific executable extension
  const exeExt = platform === 'win32' ? '.exe' : '';
  const outputPath = path.join(tempDir, `sudoku_engine_active${exeExt}`); // Ensure consistent naming

  // Platform-specific compilation command
  const compileCmd = platform === 'win32'
    ? `g++ "${sourcePath}" -o "${outputPath}" -O2`
    : `g++ "${sourcePath}" -o "${outputPath}" -O2`;

  console.log('Compiling Sudoku engine...');
  console.log('Platform:', platform);
  console.log('Command:', compileCmd);

  try {
    await new Promise((resolve, reject) => {
      exec(compileCmd, (error, stdout, stderr) => {
        if (error) {
          console.error('Compilation error:', stderr || error.message);
          reject(error);
          return;
        }
        resolve(stdout);
      });
    });

    const stats = await fs.stat(outputPath);
    console.log('Compilation successful!');
    console.log('Executable size:', stats.size, 'bytes');
    console.log('Executable path:', outputPath);
  } catch (error) {
    console.error('Failed to compile:', error.message);
    process.exit(1);
  }
}

compileEngine();
