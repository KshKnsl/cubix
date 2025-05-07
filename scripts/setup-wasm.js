const { execSync } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const isWindows = os.platform() === 'win32';
const root = path.join(__dirname, '..');

console.log('Setting up WebAssembly environment...');

// Function to execute commands with proper error handling
function runCommand(command, cwd = root) {
  try {
    console.log(`> ${command}`);
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      shell: isWindows ? 'cmd.exe' : '/bin/bash'
    });
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Activate Emscripten SDK
console.log('\n---- Activating Emscripten SDK ----');
const activateEmSDK = isWindows 
  ? 'emsdk\\emsdk.bat install latest && emsdk\\emsdk.bat activate latest'
  : './emsdk/emsdk install latest && ./emsdk/emsdk activate latest';

if (!runCommand(activateEmSDK)) {
  console.error('Failed to activate Emscripten SDK. Please check the error messages above.');
  process.exit(1);
}

// Set Emscripten environment
console.log('\n---- Setting up Emscripten environment ----');
const setupEnv = isWindows
  ? 'call emsdk\\emsdk_env.bat'
  : 'source ./emsdk/emsdk_env.sh';

if (isWindows) {
  // On Windows, we need to create a temporary batch file to source the environment
  const tempBatchFile = path.join(os.tmpdir(), 'setup-emscripten.bat');
  fs.writeFileSync(tempBatchFile, `
@echo off
cd ${root}
${setupEnv}
node ${path.join(root, 'scripts', 'compile-wasm.js')}
`);
  
  runCommand(`"${tempBatchFile}"`);
  
  // Clean up the temp file
  fs.unlinkSync(tempBatchFile);
} else {
  // On Unix-like systems, we can use a single command
  runCommand(`${setupEnv} && node ${path.join(root, 'scripts', 'compile-wasm.js')}`);
}

console.log('\nSetup complete! WebAssembly modules should be ready to use.');