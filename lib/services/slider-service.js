import { API_ENDPOINTS } from './api-config';

export const SliderService = {
  compileSolver: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.NUMBER_SLIDER.COMPILE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to compile Number Slider engine');
      }

      return await response.json();
    } catch (error) {
      console.error('Compilation error:', error);
      throw error;
    }
  },

  solvePuzzle: async (board) => {
    try {
      const response = await fetch(API_ENDPOINTS.NUMBER_SLIDER.EXECUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ board })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to solve Number Slider puzzle');
      }

      return await response.json();
    } catch (error) {
      console.error('Solver error:', error);
      throw error;
    }
  }
};