
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

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- C++ compiler

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KshKnsl/cubix.git
   ```
2. Navigate to the project directory:
   ```bash
   cd cubix
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
