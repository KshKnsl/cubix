#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <random>
#include <chrono>
#include <iomanip>
using namespace std;

class SudokuEngine {
private:
    // Checks if placing 'num' at position (row,col) is valid
    bool isValid(const vector<vector<int>>& grid, int row, int col, int num) {
        // Check row
        for(int x = 0; x < 9; x++)
            if(grid[row][x] == num) return false;
        
        // Check column
        for(int x = 0; x < 9; x++)
            if(grid[x][col] == num) return false;
        
        // Check 3x3 box
        int startRow = row - row % 3, startCol = col - col % 3;
        for(int i = 0; i < 3; i++)
            for(int j = 0; j < 3; j++)
                if(grid[i + startRow][j + startCol] == num) return false;
        
        return true;
    }

    // Solves the Sudoku puzzle using backtracking algorithm
    bool solveSudoku(vector<vector<int>>& grid) {
        int row = -1, col = -1;
        bool isEmpty = false;
        
        // Find first empty cell (value 0)
        for(int i = 0; i < 9; i++) {
            for(int j = 0; j < 9; j++) {
                if(grid[i][j] == 0) {
                    row = i;
                    col = j;
                    isEmpty = true;
                    break;
                }
            }
            if(isEmpty) break;
        }
        
        // If no empty cell found, puzzle is solved
        if(!isEmpty) return true;
        
        // Try digits 1-9 in the empty cell
        for(int num = 1; num <= 9; num++) {
            if(isValid(grid, row, col, num)) {
                grid[row][col] = num;
                if(solveSudoku(grid)) return true; // Recursively solve the rest
                grid[row][col] = 0; // Backtrack if solution not found
            }
        }
        return false; // No solution exists
    }

    // Converts a flat array of 81 values to a 9x9 grid
    vector<vector<int>> parseBoard(const vector<int>& values) {
        if (values.size() != 81) {
            throw runtime_error("Invalid board size");
        }

        vector<vector<int>> grid(9, vector<int>(9, 0));
        for(int i = 0; i < 9; i++) {
            for(int j = 0; j < 9; j++) {
                int val = values[i * 9 + j];
                if (val < 0 || val > 9) {
                    throw runtime_error("Invalid value in board");
                }
                grid[i][j] = val;
            }
        }
        return grid;
    }

    // Converts a 9x9 grid to a comma-separated string
    string gridToString(const vector<vector<int>>& grid) {
        stringstream result;
        for(int i = 0; i < 9; i++) {
            for(int j = 0; j < 9; j++) {
                result << grid[i][j];
                if(i != 8 || j != 8) result << ",";
            }
        }
        return result.str();
    }

public:
    // Solves the given Sudoku board and returns solution as string
    string solve(const vector<int>& values) {
        try {
            auto grid = parseBoard(values);
            
            
            if(!solveSudoku(grid)) {
                return "Error: No solution exists";
            }
            return gridToString(grid);
        } catch (const exception& e) {
            return string("Error: ") + e.what();
        }
    }

    // Returns the correct number for position (row,col) as a hint
    string getHint(const vector<int>& values, int row, int col) {
        try {
            if(row < 0 || row >= 9 || col < 0 || col >= 9) {
                return "Error: Invalid position";
            }

            auto grid = parseBoard(values);
            if(grid[row][col] != 0) {
                return "Error: Cell already filled";
            }

            // Get solution
            auto solution = grid;
            if(!solveSudoku(solution)) {
                return "Error: Board has no solution";
            }

            return to_string(solution[row][col]);
        } catch (const exception& e) {
            return string("Error: ") + e.what();
        }
    }

    // Checks if the current board state is valid (no conflicts)
    string checkValidity(const vector<int>& values) {
        try {
            auto grid = parseBoard(values);
            
            // Check each non-empty cell against Sudoku rules
            for(int i = 0; i < 9; i++) {
                for(int j = 0; j < 9; j++) {
                    if(grid[i][j] != 0) {
                        int temp = grid[i][j];
                        grid[i][j] = 0;
                        if(!isValid(grid, i, j, temp)) {
                            return "Invalid";
                        }
                        grid[i][j] = temp;
                    }
                }
            }
            return "Valid";
        } catch (const exception& e) {
            return string("Error: ") + e.what();
        }
    }
};

// Main function - processes command line arguments and invokes the engine
int main(int argc, char* argv[]) {
    if(argc < 83) { // 1 for program name, 1 for command, 81 for board
        cerr << "Usage: " << argv[0] << " <command> <81 board values> [row col]" << endl;
        return 1;
    }

    try {
        // Parse the board values from command line
        vector<int> board;
        for(int i = 2; i < 83; i++) {
            board.push_back(stoi(argv[i]));
        }

        SudokuEngine engine;
        string command = argv[1];

        // Process different commands
        if(command == "solve") {
            cout << engine.solve(board) << endl;
        }
        else if(command == "check") {
            cout << engine.checkValidity(board) << endl;
        }
        else if(command == "hint") {
            if(argc < 85) {
                cerr << "Error: Not enough arguments for hint command" << endl;
                return 1;
            }
            int row = stoi(argv[83]);
            int col = stoi(argv[84]);
            cout << engine.getHint(board, row, col) << endl;
        }
        else {
            cerr << "Error: Unknown command: " << command << endl;
            return 1;
        }
    } catch(const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }

    return 0;
}
