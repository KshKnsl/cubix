// Using WebAssembly to run Sudoku solver directly in the browser
let sudokuModule = null;
let sudokuEngine = null;

// Load the WebAssembly module
async function loadSudokuModule() {
  if (sudokuModule !== null) {
    return sudokuModule;
  }

  try {
    if (typeof window === "undefined")
      throw new Error("WASM modules can only be loaded in the browser");

    const wasm = await import(/* webpackIgnore: true */ "/wasm/sudoku.js");
    const factory = wasm.default;
    sudokuModule = await factory();
    return sudokuModule;
  } catch (error) {
    console.error("Failed to load Sudoku WASM module:", error);
    throw new Error("Failed to initialize Sudoku engine");
  }
}

export const SudokuService = {
  // Initialize the Sudoku solver
  initSolver: async () => {
    try {
      const module = await loadSudokuModule();
      sudokuEngine = new module.SudokuEngine();
      return { success: true };
    } catch (error) {
      console.error("Initialization error:", error);
      throw error;
    }
  },

  // Solve a Sudoku puzzle
  solvePuzzle: async (puzzle) => {
    try {
      if (!sudokuEngine) {
        await SudokuService.initSolver();
      }

      // Convert 2D array to 1D array for the WASM module
      const flatPuzzle = puzzle.flat();
      // Convert JS array to Emscripten IntVector for wasm binding
      const vec = new sudokuModule.IntVector();
      flatPuzzle.forEach(n => vec.push_back(n));
      const result = sudokuEngine.solve(vec);
      console.log(result);
      vec.delete();

      if (result.startsWith("Error:")) {
        throw new Error(result);
      }

      // Parse the solution back to a 2D array
      const solution = result.split(",").map((num) => parseInt(num));
      const grid = [];
      for (let i = 0; i < 9; i++) {
        grid.push(solution.slice(i * 9, (i + 1) * 9));
      }

      return grid;
    } catch (error) {
      console.error("Solver error:", error);
      throw error;
    }
  },

  // Check if the current Sudoku board is valid
  checkValidity: async (puzzle) => {
    try {
      if (!sudokuEngine) {
        await SudokuService.initSolver();
      }

      // Convert 2D array to 1D array for the WASM module
      const flatPuzzle = puzzle.flat();
      // Convert to IntVector for wasm
      const vec = new sudokuModule.IntVector();
      flatPuzzle.forEach(n => vec.push_back(n));
      const result = sudokuEngine.checkValidity(vec);
      vec.delete();

      return {
        isValid: !result.includes("Invalid"),
        message: result,
      };
    } catch (error) {
      console.error("Validity check error:", error);
      throw error;
    }
  },

  // Get a hint for the specified cell
  getHint: async (puzzle, row, col) => {
    try {
      if (!sudokuEngine) {
        await SudokuService.initSolver();
      }

      // Convert 2D array to 1D array for the WASM module
      const flatPuzzle = puzzle.flat();
      // Convert to IntVector for wasm
      const vec = new sudokuModule.IntVector();
      flatPuzzle.forEach(n => vec.push_back(n));
      const result = sudokuEngine.getHint(vec, row, col);
      vec.delete();

      if (result.startsWith("Error:")) {
        throw new Error(result);
      }

      return parseInt(result);
    } catch (error) {
      console.error("Hint error:", error);
      throw error;
    }
  },

  // Alias for loadSudokuModule
  compileSolver: async () => await loadSudokuModule(),
};
