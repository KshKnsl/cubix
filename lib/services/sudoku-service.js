import { API_ENDPOINTS } from './api-config';

export const SudokuService = {
  compileSolver: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SUDOKU.COMPILE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to compile Sudoku engine');
      }

      return await response.json();
    } catch (error) {
      console.error('Compilation error:', error);
      throw error;
    }
  },

  solvePuzzle: async (board) => {
    try {
      const response = await fetch(API_ENDPOINTS.SUDOKU.EXECUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: 'solve',
          args: board
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to solve Sudoku puzzle');
      }

      return await response.json();
    } catch (error) {
      console.error('Solver error:', error);
      throw error;
    }
  },

  checkPuzzle: async (board) => {
    try {
      const response = await fetch(API_ENDPOINTS.SUDOKU.EXECUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: 'check',
          args: board
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check Sudoku puzzle');
      }

      return await response.json();
    } catch (error) {
      console.error('Check error:', error);
      throw error;
    }
  },

  getHint: async (board, row, col) => {
    try {
      const response = await fetch(API_ENDPOINTS.SUDOKU.EXECUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: 'hint',
          args: [...board, row, col]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get hint for Sudoku puzzle');
      }

      return await response.json();
    } catch (error) {
      console.error('Hint error:', error);
      throw error;
    }
  }
};