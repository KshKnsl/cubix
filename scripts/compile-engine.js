const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

async function compileEngine() {
  const platform = os.platform();
  const sudokuTempDir = path.join(os.tmpdir(), 'cubix-sudoku');
  const sliderTempDir = path.join(os.tmpdir(), 'cubix-slider');
  const rubixTempDir = path.join(os.tmpdir(), 'rubix');
  await fs.mkdir(sudokuTempDir, { recursive: true });
  await fs.mkdir(sliderTempDir, { recursive: true });
  await fs.mkdir(rubixTempDir, { recursive: true }); // Add mkdir for rubix directory

  const exeExt = platform === 'win32' ? '.exe' : ''; // Determine extension based on platform

  const engines = [
    { source: 'cpp/sudoku_engine.cpp', output: `sudoku_engine${exeExt}`, tempDir: sudokuTempDir },
    { source: 'cpp/number_slider_engine.cpp', output: `number_slider_engine${exeExt}`, tempDir: sliderTempDir },
    { source: 'cpp/rubix.cpp', output: `rubix${exeExt}`, tempDir: rubixTempDir },
  ];

  for (const { source, output, tempDir } of engines) {
    const outputPath = path.join(tempDir, output); // Avoid appending .exe twice
    const compileCmd = `g++ -std=c++11 "${path.join(process.cwd(), source)}" -o "${outputPath}" -O2`;

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

