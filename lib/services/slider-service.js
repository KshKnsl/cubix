// Using WebAssembly to run Number Slider solver directly in the browser
let sliderModule = null;
let sliderSolver = null;

// Add basePath for production under GitHub Pages hosting
const BASE_PATH = process.env.NODE_ENV === 'production' ? '/cubix' : '';

// Load the WebAssembly module
async function loadSliderModule() {
  if (sliderModule !== null) {
    return sliderModule;
  }

  try {
    // Use process.env check to avoid server-side imports
    if (typeof window === 'undefined') {
      throw new Error('WASM modules can only be loaded in the browser');
    }

    // Dynamic import of the WASM module with proper path
    const wasm = await import(/* webpackIgnore: true */ `${BASE_PATH}/wasm/number_slider.js`);
    const factory = wasm.default;
    sliderModule = await factory();
    return sliderModule;
  } catch (error) {
    console.error('Failed to load Number Slider WASM module:', error);
    throw new Error('Failed to initialize Number Slider engine');
  }
}

export const SliderService = {
  // Initialize the Number Slider solver
  initSolver: async () => {
    try {
      const module = await loadSliderModule();
      sliderSolver = new module.NumberSliderEngine();
      return { success: true };
    } catch (error) {
      console.error('Initialization error:', error);
      throw error;
    }
  },

  // Solve a Number Slider puzzle
  solvePuzzle: async (puzzle) => {
    try {
      if (!sliderSolver) {
        await SliderService.initSolver();
      }

      // Make sure we have a flat 1D array
      const flatPuzzle = Array.isArray(puzzle[0]) ? puzzle.flat() : puzzle;
      // Convert JS array to Emscripten IntVector for wasm binding
      const vec = new sliderModule.IntVector();
      flatPuzzle.forEach(n => vec.push_back(n));
      const result = sliderSolver.solve(vec);
      console.log(result);
      vec.delete();

      if (result.startsWith('Error:')) {
        throw new Error(result);
      }
      
      // Parse the solution into moves
      // WASM returns either a parenthesized coordinate string or a direction string (e.g. "URDL...")
      const trimmed = result.trim();
      let moves;
      // If only letters U/D/L/R, split into individual direction moves
      const dirs = trimmed.match(/[UDLR]/g);
      if (dirs && dirs.length === trimmed.length) {
        moves = dirs; // array of single-letter direction strings
      } else {
        // Otherwise assume space-separated "(r,c)" entries
        moves = trimmed.split(' ').filter(m => m.length > 0);
      }
      
      return {
        moves,
        totalMoves: moves.length
      };
    } catch (error) {
      console.error('Solver error:', error);
      throw error;
    }
  },

  // Alias for initSolver
  compileSolver: async () => await SliderService.initSolver()
};