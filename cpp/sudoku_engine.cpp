#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <random>
#include <chrono>
using namespace std;

class SudokuEngine {
private:
    vector<vector<int>> board;
    vector<vector<int>> solution;

    bool isValid(int row, int col, int num) {
        // Check row
        for(int x = 0; x < 9; x++)
            if(board[row][x] == num) return false;
        
        // Check column
        for(int x = 0; x < 9; x++)
            if(board[x][col] == num) return false;
        
        // Check 3x3 box
        int startRow = row - row % 3, startCol = col - col % 3;
        for(int i = 0; i < 3; i++)
            for(int j = 0; j < 3; j++)
                if(board[i + startRow][j + startCol] == num) return false;
        
        return true;
    }

    bool solveSudoku() {
        int row, col;
        bool isEmpty = false;
        
        // Find empty cell
        for(row = 0; row < 9; row++) {
            for(col = 0; col < 9; col++) {
                if(board[row][col] == 0) {
                    isEmpty = true;
                    break;
                }
            }
            if(isEmpty) break;
        }
        
        // If no empty cell found, puzzle is solved
        if(!isEmpty) return true;
        
        // Try digits 1-9
        for(int num = 1; num <= 9; num++) {
            if(isValid(row, col, num)) {
                board[row][col] = num;
                if(solveSudoku()) return true;
                board[row][col] = 0;
            }
        }
        return false;
    }

    string getHint(int row, int col) {
        if(board[row][col] != 0) return "Cell already filled";
        for(int num = 1; num <= 9; num++) {
            if(isValid(row, col, num)) {
                return "Try " + to_string(num);
            }
        }
        return "No valid moves";
    }

public:
    SudokuEngine() {
        board = vector<vector<int>>(9, vector<int>(9, 0));
        solution = vector<vector<int>>(9, vector<int>(9, 0));
    }

    void setBoard(const string& input) {
        stringstream ss(input);
        for(int i = 0; i < 9; i++) {
            for(int j = 0; j < 9; j++) {
                int val;
                ss >> val;
                board[i][j] = val;
            }
        }
        // Store solution
        vector<vector<int>> temp = board;
        solveSudoku();
        solution = board;
        board = temp;
    }

    string solve() {
        if(!solveSudoku()) return "No solution exists";
        
        stringstream result;
        for(int i = 0; i < 9; i++) {
            for(int j = 0; j < 9; j++) {
                result << board[i][j] << " ";
            }
        }
        return result.str();
    }

    string checkValidity() {
        // Check rows
        for(int i = 0; i < 9; i++) {
            vector<bool> seen(10, false);
            for(int j = 0; j < 9; j++) {
                if(board[i][j] != 0) {
                    if(seen[board[i][j]]) return "Invalid: Row " + to_string(i+1) + " has duplicate";
                    seen[board[i][j]] = true;
                }
            }
        }

        // Check columns
        for(int j = 0; j < 9; j++) {
            vector<bool> seen(10, false);
            for(int i = 0; i < 9; i++) {
                if(board[i][j] != 0) {
                    if(seen[board[i][j]]) return "Invalid: Column " + to_string(j+1) + " has duplicate";
                    seen[board[i][j]] = true;
                }
            }
        }

        // Check 3x3 boxes
        for(int block = 0; block < 9; block++) {
            vector<bool> seen(10, false);
            int startRow = (block/3) * 3;
            int startCol = (block%3) * 3;
            for(int i = startRow; i < startRow+3; i++) {
                for(int j = startCol; j < startCol+3; j++) {
                    if(board[i][j] != 0) {
                        if(seen[board[i][j]]) return "Invalid: Box at (" + to_string(startRow+1) + "," + to_string(startCol+1) + ") has duplicate";
                        seen[board[i][j]] = true;
                    }
                }
            }
        }
        return "Valid";
    }

    string getHintForCell(const string& input) {
        stringstream ss(input);
        int row, col;
        ss >> row >> col;
        if(row < 0 || row >= 9 || col < 0 || col >= 9)
            return "Invalid cell position";
        return getHint(row, col);
    }

    string getSolution() {
        stringstream result;
        for(int i = 0; i < 9; i++) {
            for(int j = 0; j < 9; j++) {
                result << solution[i][j] << " ";
            }
        }
        return result.str();
    }
};

int main() {
    SudokuEngine engine;
    string command;
    
    while(getline(cin, command)) {
        if(command == "exit") break;
        
        if(command == "set") {
            string board;
            getline(cin, board);
            engine.setBoard(board);
            cout << "Board set successfully" << endl;
        }
        else if(command == "solve") {
            cout << engine.solve() << endl;
        }
        else if(command == "check") {
            cout << engine.checkValidity() << endl;
        }
        else if(command == "hint") {
            string pos;
            getline(cin, pos);
            cout << engine.getHintForCell(pos) << endl;
        }
        else if(command == "solution") {
            cout << engine.getSolution() << endl;
        }
        else {
            cout << "Unknown command" << endl;
        }
    }
    return 0;
}
