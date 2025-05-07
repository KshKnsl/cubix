// API configuration
const isDevelopment = process.env.NODE_ENV === 'development' || (typeof window !== 'undefined' && window.location.hostname === 'localhost');

// Configure the API base URL based on environment
let API_BASE_URL;
if (isDevelopment) {
  API_BASE_URL = 'http://localhost:5000'; // Development server URL
} else if (typeof window !== 'undefined') {
  // In production/GitHub Pages, use the current origin
  API_BASE_URL = window.location.origin;
} else {
  // During SSR/build time in production
  API_BASE_URL = '';
}

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

// Remove GitHub Pages flag since we're using real API calls everywhere
export const useRealAPICalls = true;