const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Paths
const cppDir = path.join(__dirname, '..', 'cpp');
const wasmOutputDir = path.join(__dirname, '..', 'public', 'wasm');
const isWindows = os.platform() === 'win32';

// Find Emscripten compiler
function findEmcc() {
  // Look in the local emsdk directory first
  const localEmcc = isWindows
    ? path.join(__dirname, '..', 'emsdk', 'upstream', 'emscripten', 'emcc.bat')
    : path.join(__dirname, '..', 'emsdk', 'upstream', 'emscripten', 'emcc');
  
  if (fs.existsSync(localEmcc)) {
    return localEmcc;
  }
  
  // Fall back to system PATH
  return isWindows ? 'emcc.bat' : 'emcc';
}

const emcc = findEmcc();
console.log(`Using Emscripten compiler: ${emcc}`);

// Ensure the output directory exists
if (!fs.existsSync(wasmOutputDir)) {
  fs.mkdirSync(wasmOutputDir, { recursive: true });
}

// Helper function to compile a C++ file to WebAssembly
function compileToWasm(inputFile, outputName) {
  console.log(`Compiling ${inputFile} to WebAssembly...`);
  
  try {
    // Emscripten command to compile to wasm with embind support
    const command = `"${emcc}" "${path.join(cppDir, inputFile)}" -o "${path.join(wasmOutputDir, outputName)}.js" -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap'] -s EXPORT_ES6=1 -s MODULARIZE=1 -s "EXPORTED_FUNCTIONS=['_malloc','_free']" -s NO_EXIT_RUNTIME=1 -lembind -O3 -std=c++17`;
    
    execSync(command, { stdio: 'inherit' });
    console.log(`Successfully compiled ${inputFile} to WebAssembly`);
  } catch (error) {
    console.error(`Failed to compile ${inputFile}:`, error.message);
    process.exit(1);
  }
}

// Compile all modules
compileToWasm('sudoku_wasm.cpp', 'sudoku');
compileToWasm('number_slider_wasm.cpp', 'number_slider');
compileToWasm('rubix_wasm.cpp', 'rubix');

console.log('WebAssembly compilation complete!');