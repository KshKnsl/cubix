// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Empty base URL for same-origin requests in production
  : 'http://localhost:5000'; // Development server URL

export const API_ENDPOINTS = {
  SUDOKU: {
    EXECUTE: `${API_BASE_URL}/api/sudoku/execute`,
    COMPILE: `${API_BASE_URL}/api/sudoku/compile`
  },
  NUMBER_SLIDER: {
    EXECUTE: `${API_BASE_URL}/api/number-slider/execute`,
    COMPILE: `${API_BASE_URL}/api/number-slider/compile`
  },
  RUBIX: {
    EXECUTE: `${API_BASE_URL}/api/rubix/execute`,
    COMPILE: `${API_BASE_URL}/api/rubix/compile`
  }
};