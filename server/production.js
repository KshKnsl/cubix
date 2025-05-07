const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();

// API routes - import the routes from our existing server setup
const sudokuRoutes = require('./routes/sudoku');
const sliderRoutes = require('./routes/slider');
const rubixRoutes = require('./routes/rubix');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/sudoku', sudokuRoutes);
app.use('/api/number-slider', sliderRoutes);
app.use('/api/rubix', rubixRoutes);

// Serve static files from the 'out' directory (Next.js output)
app.use(express.static(path.join(__dirname, '..', 'out')));

// For any other route, serve the Next.js app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'out', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Production server running on port ${PORT}`);
});