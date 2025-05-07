import { API_ENDPOINTS } from './api-config';

export const RubixService = {
  compileSolver: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.RUBIX.COMPILE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to compile Rubik\'s Cube engine');
      }

      return await response.json();
    } catch (error) {
      console.error('Compilation error:', error);
      throw error;
    }
  },

  solvePuzzle: async (startState, finalState) => {
    try {
      const response = await fetch(API_ENDPOINTS.RUBIX.EXECUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          startState,
          finalState
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to solve Rubik\'s Cube puzzle');
      }

      return await response.json();
    } catch (error) {
      console.error('Solver error:', error);
      throw error;
    }
  }
};