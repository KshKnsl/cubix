// Using WebAssembly to run Rubik's Cube solver directly in the browser
let rubixModule = null;
let rubixSolver = null;

// Add basePath for production under GitHub Pages hosting
const BASE_PATH = process.env.NODE_ENV === 'production' ? '/cubix' : '';

// Load the WebAssembly module
async function loadRubixModule() {
  if (rubixModule !== null) {
    return rubixModule;
  }

  try {
    // Use process.env check to avoid server-side imports
    if (typeof window === 'undefined') {
      throw new Error('WASM modules can only be loaded in the browser');
    }
    
    // Dynamic import of the WASM module with proper path
    const wasm = await import(/* webpackIgnore: true */ `${BASE_PATH}/wasm/rubix.js`);
    // Default export is the factory to instantiate the module
    const factory = wasm.default;
    rubixModule = await factory();
    return rubixModule;
  } catch (error) {
    console.error('Failed to load Rubik\'s Cube WASM module:', error);
    throw new Error('Failed to initialize Rubik\'s Cube engine');
  }
}

export const RubixService = {
  // Initialize the Rubik's Cube solver
  initSolver: async () => {
    try {
      const module = await loadRubixModule();
      // Instantiate the WASM engine class as bound in rubix_wasm.cpp
      rubixSolver = new module.RubiksCubeEngine();
      return { success: true };
    } catch (error) {
      console.error('Initialization error:', error);
      throw error;
    }
  },

  // Solve a Rubik's Cube
  solveCube: async (cubeState) => {
    try {
      if (!rubixSolver) {
        await RubixService.initSolver();
      }




      

      // Solve the cube - expect cubeState to be a 3D array representation
      // We need to flatten this to a 1D array for the WASM module
      const flatState = cubeState.flat().flat();
      
      // Provide the start state then call solve with no args
      rubixSolver.setStartState(flatState);
      const result = rubixSolver.solve();
      
      if (result.startsWith('Error:')) {
        throw new Error(result);
      }
      
      // Parse the solution into individual moves
      const moves = result.trim().split(' ').filter(move => move.length > 0);
      
      return {
        moves,
        totalMoves: moves.length
      };
    } catch (error) {
      console.error('Solver error:', error);
      throw error;
    }
  },

  // Check if the cube is solved
  isSolved: async (cubeState) => {
    try {
      if (!rubixSolver) {
        await RubixService.initSolver();
      }

      const flatState = cubeState.flat().flat();
      const result = rubixSolver.isSolved(flatState);
      
      return {
        solved: result === "true",
      };
    } catch (error) {
      console.error('Check error:', error);
      throw error;
    }
  },
  
  // Apply a move to the cube
  applyMove: async (cubeState, move) => {
    try {
      if (!rubixSolver) {
        await RubixService.initSolver();
      }

      const flatState = cubeState.flat().flat();
      const result = rubixSolver.applyMove(flatState, move);
      
      if (result.startsWith('Error:')) {
        throw new Error(result);
      }
      
      // Parse the result back into a 3D array
      const newFlatState = result.split(',').map(val => parseInt(val));
      const newState = [];
      
      // Reconstruct the 3D array (6 faces, each 3x3)
      for (let face = 0; face < 6; face++) {
        const faceArr = [];
        for (let i = 0; i < 3; i++) {
          const row = [];
          for (let j = 0; j < 3; j++) {
            row.push(newFlatState[face * 9 + i * 3 + j]);
          }
          faceArr.push(row);
        }
        newState.push(faceArr);
      }
      
      return newState;
    } catch (error) {
      console.error('Move error:', error);
      throw error;
    }
  },
  
  // Scramble the cube
  scrambleCube: async (moves = 20) => {
    try {
      if (!rubixSolver) {
        await RubixService.initSolver();
      }

      const result = rubixSolver.scramble(moves);
      
      if (result.startsWith('Error:')) {
        throw new Error(result);
      }
      
      // Split into the scramble sequence and the resulting cube state
      const [moveSequence, stateStr] = result.split('|');
      
      // Parse moves
      const movesArray = moveSequence.trim().split(' ').filter(move => move.length > 0);
      
      // Parse the cube state to a 3D array
      const flatState = stateStr.split(',').map(val => parseInt(val));
      const cubeState = [];
      
      // Reconstruct the 3D array (6 faces, each 3x3)
      for (let face = 0; face < 6; face++) {
        const faceArr = [];
        for (let i = 0; i < 3; i++) {
          const row = [];
          for (let j = 0; j < 3; j++) {
            row.push(flatState[face * 9 + i * 3 + j]);
          }
          faceArr.push(row);
        }
        cubeState.push(faceArr);
      }
      
      return {
        moves: movesArray,
        state: cubeState
      };
    } catch (error) {
      console.error('Scramble error:', error);
      throw error;
    }
  }
};