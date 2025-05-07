const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');
require('dotenv').config();

// Import routes
const sudokuRoutes = require('./routes/sudoku');
const sliderRoutes = require('./routes/slider');
const rubixRoutes = require('./routes/rubix');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create necessary temp directories
const createTempDirectories = async () => {
  const dirs = [
    path.join(os.tmpdir(), 'cubix-sudoku'),
    path.join(os.tmpdir(), 'cubix-slider'),
    path.join(os.tmpdir(), 'rubix')
  ];
  
  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(`Created temp directory: ${dir}`);
    } catch (error) {
      console.error(`Failed to create temp directory ${dir}:`, error);
    }
  }
};

// Routes
app.use('/api/sudoku', sudokuRoutes);
app.use('/api/number-slider', sliderRoutes);
app.use('/api/rubix', rubixRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('out'));
  
  // Any route that's not API will be redirected to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'out', 'index.html'));
  });
}

// Create necessary directories and start server
createTempDirectories().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});