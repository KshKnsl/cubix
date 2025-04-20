import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

async function compileEngine() {
  const platform = os.platform();
  const sudokuTempDir = path.join(os.tmpdir(), 'cubix-sudoku');
  const sliderTempDir = path.join(os.tmpdir(), 'cubix-slider'); // Separate directory for Number Slider
  await fs.mkdir(sudokuTempDir, { recursive: true });
  await fs.mkdir(sliderTempDir, { recursive: true });

  const exeExt = platform === 'win32' ? '.exe' : ''; // Determine extension based on platform

  const engines = [
    { source: 'cpp/sudoku_engine.cpp', output: `sudoku_engine${exeExt}`, tempDir: sudokuTempDir },
    { source: 'cpp/number_slider_engine.cpp', output: `number_slider_engine${exeExt}`, tempDir: sliderTempDir }
  ];

  for (const { source, output, tempDir } of engines) {
    const outputPath = path.join(tempDir, output); // Avoid appending .exe twice
    const compileCmd = `g++ "${path.join(process.cwd(), source)}" -o "${outputPath}" -O2`;

    console.log(`Compiling ${output}...`);
    console.log('Command:', compileCmd);

    try {
      await new Promise((resolve, reject) => {
        exec(compileCmd, (error, stdout, stderr) => {
          if (error) {
            console.error(`Compilation error for ${output}:`, stderr || error.message);
            reject(error);
            return;
          }
          resolve(stdout);
        });
      });
      console.log(`${output} compiled successfully!`);
    } catch (error) {
      console.error(`Failed to compile ${output}:`, error.message);
      process.exit(1);
    }
  }

  console.log('Executables compiled and placed in their respective directories.');
}

compileEngine().catch((error) => {
  console.error('Error during compilation:', error);
  process.exit(1);
});
