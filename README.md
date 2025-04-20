# Cubix - A Puzzle Solving Tool

## Project Synopsis
Cubix is a web-based puzzle solver designed to solve multiple types of puzzles, including:

### Rubik’s Cube  
![Rubik’s Cube](https://github.com/user-attachments/assets/6b4dc7f8-e67e-436e-95f9-209884150401)

### Number Slider Puzzle (15-puzzle)  
![Number Slider Puzzle](https://github.com/user-attachments/assets/401cb300-37a9-44b8-9d69-c01c75993ac0)

### Sudoku  
![Sudoku](https://github.com/user-attachments/assets/5f188c5d-d713-4a61-8473-c0bbf58d9973)

## Project Objective
The objective of this project is to provide an intuitive and efficient puzzle-solving tool. The frontend is developed using React to offer a user-friendly interface for puzzle input and solution visualization. The backend, implemented in C++, utilizes efficient algorithms to solve each puzzle and communicates the solutions to the frontend.

## Project Architecture

### Frontend (React)
**User Interface:**
- Input fields for Sudoku, Number Slider, and Rubik’s Cube.
- Toggle between Play Mode (manual play) and Solver Mode (automated solving).
- Step-by-step solution visualization.

**State Management:**
- Uses React hooks or a state management library to handle puzzle states.

### Backend (C++)
- Implements efficient solving algorithms for each puzzle.
- Provides API endpoints for communication with the frontend.
- Optimized for real-time solution delivery.

## Solving Algorithms

### Rubik’s Cube Solver
- Utilizes Kociemba’s Algorithm (two-phase solving approach).
- Represents the cube using a 2D array or facelet notation.
- Implements a BFS-based approach for basic solving.

### Number Slider Puzzle (15-puzzle)
- Uses A* Search Algorithm with Manhattan Distance heuristic for optimal pathfinding.
- Optionally integrates IDA* (Iterative Deepening A*) for enhanced search efficiency.
- Represents the board as a 2D vector.

### Sudoku Solver
- Implements the Backtracking Algorithm with constraint propagation for basic solutions.
- Uses Dancing Links (DLX) for an optimized exact cover approach.

## Conclusion
Cubix combines an intuitive React-based UI with efficient C++ algorithms to deliver a seamless puzzle-solving experience. By leveraging advanced techniques such as Kociemba’s Algorithm, A* search, and Dancing Links, Cubix ensures optimized solutions for each puzzle type, making it a valuable tool for both enthusiasts and researchers in the field of algorithmic problem-solving.

## Setup Instructions

### Prerequisites

#### Windows
1. Install MinGW-w64 (includes g++):
   - Download from: https://www.mingw-w64.org/
   - Add MinGW-w64 bin directory to system PATH

#### macOS
1. Install Xcode Command Line Tools (includes g++):
   ```bash
   xcode-select --install
   ```

#### Linux
1. Install g++:
   ```bash
   sudo apt update
   sudo apt install g++  # For Ubuntu/Debian
   # OR
   sudo dnf install gcc-c++  # For Fedora
   ```

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/KshKnsl/cubix.git
   cd cubix
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   This will automatically compile the C++ engine during installation.

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

### Troubleshooting
- If you encounter compilation errors:
  1. Ensure g++ is properly installed: `g++ --version`
  2. Manually compile the engine: `npm run compile-engine`
  3. Check the logs in `%TEMP%/cubix-sudoku` (Windows) or `/tmp/cubix-sudoku` (Mac/Linux)

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- C++ compiler

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
