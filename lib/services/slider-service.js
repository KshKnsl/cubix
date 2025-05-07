// Using WebAssembly to run Number Slider solver directly in the browser
let sliderModule = null;
let sliderSolver = null;

// Load the WebAssembly module
async function loadSliderModule() {
  if (sliderModule !== null) {
    return sliderModule;
  }

  try {
    // Dynamic import of the WASM module
    const module = await import('/wasm/number_slider.js');
    sliderModule = await module.NumberSliderModule();
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
      sliderSolver = new module.NumberSliderSolver();
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
      
      // Solve the puzzle
      const result = sliderSolver.solve(flatPuzzle);
      
      if (result.startsWith('Error:')) {
        throw new Error(result);
      }
      
      // Parse the solution into moves
      // Format is like "(0,1) (1,2) (3,3)" - coordinates of tiles to move
      const moves = result.trim().split(' ')
        .filter(move => move.length > 0)
        .map(move => {
          // Extract coordinates from "(row,col)" format
          const coords = move.replace('(', '').replace(')', '').split(',');
          return {
            row: parseInt(coords[0]),
            col: parseInt(coords[1])
          };
        });
      
      return {
        moves,
        totalMoves: moves.length
      };
    } catch (error) {
      console.error('Solver error:', error);
      throw error;
    }
  }
};