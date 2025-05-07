#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <string>
#include <vector>
#include <queue>
#include <unordered_set>
#include <sstream>
#include <algorithm>

using namespace emscripten;

class NumberSliderEngine {
private:
    struct State {
        std::vector<int> board;
        int emptyPos;
        int size;
        int moves;
        std::string path;

        State(const std::vector<int>& b, int s, int e, int m, std::string p) 
            : board(b), size(s), emptyPos(e), moves(m), path(p) {}

        // Generate a unique string representation of the state for comparison
        std::string toString() const {
            std::stringstream ss;
            for (int val : board) {
                ss << val << ",";
            }
            return ss.str();
        }
    };

    // Calculate the Manhattan distance heuristic
    int calculateManhattan(const std::vector<int>& board, int size) {
        int distance = 0;
        for (int i = 0; i < board.size(); i++) {
            if (board[i] != 0) {  // Skip the empty space
                int goalRow = (board[i] - 1) / size;
                int goalCol = (board[i] - 1) % size;
                int currentRow = i / size;
                int currentCol = i % size;
                distance += abs(currentRow - goalRow) + abs(currentCol - goalCol);
            }
        }
        return distance;
    }

    // Check if the puzzle is solvable
    bool isSolvable(const std::vector<int>& board, int size) {
        // Count inversions
        int inversions = 0;
        for (int i = 0; i < board.size(); i++) {
            if (board[i] == 0) continue;  // Skip the empty space
            
            for (int j = i + 1; j < board.size(); j++) {
                if (board[j] == 0) continue;  // Skip the empty space
                
                if (board[i] > board[j]) {
                    inversions++;
                }
            }
        }

        // For odd-sized grids, the puzzle is solvable if inversions is even
        if (size % 2 == 1) {
            return inversions % 2 == 0;
        } else {
            // For even-sized grids, we also need to consider the row of the empty space
            int emptyPos = std::find(board.begin(), board.end(), 0) - board.begin();
            int emptyRow = emptyPos / size;
            // Puzzle is solvable if (inversions + emptyRow) is odd
            return (inversions + emptyRow) % 2 == 1;
        }
    }

    // Find possible moves from current state
    std::vector<int> getPossibleMoves(int emptyPos, int size) {
        std::vector<int> moves;
        int row = emptyPos / size;
        int col = emptyPos % size;
        
        // Up
        if (row > 0) {
            moves.push_back(emptyPos - size);
        }
        
        // Down
        if (row < size - 1) {
            moves.push_back(emptyPos + size);
        }
        
        // Left
        if (col > 0) {
            moves.push_back(emptyPos - 1);
        }
        
        // Right
        if (col < size - 1) {
            moves.push_back(emptyPos + 1);
        }
        
        return moves;
    }

    // Get the direction of the move as a string
    std::string getMoveDirection(int from, int to, int size) {
        int fromRow = from / size;
        int fromCol = from % size;
        int toRow = to / size;
        int toCol = to % size;
        
        if (fromRow > toRow) return "U";  // Moving up
        if (fromRow < toRow) return "D";  // Moving down
        if (fromCol > toCol) return "L";  // Moving left
        if (fromCol < toCol) return "R";  // Moving right
        return "";
    }

    // Check if the board is in goal state (sorted with empty at the end)
    bool isGoalState(const std::vector<int>& board) {
        for (int i = 0; i < board.size() - 1; i++) {
            if (board[i] != i + 1) {
                return false;
            }
        }
        return board.back() == 0;
    }

public:
    NumberSliderEngine() {}

    // Solve the Number Slider puzzle using A* algorithm
    std::string solve(const std::vector<int>& inputBoard) {
        if (inputBoard.empty()) {
            return "Error: Empty board";
        }
        
        // Calculate board size
        int size = static_cast<int>(sqrt(inputBoard.size()));
        if (size * size != inputBoard.size()) {
            return "Error: Board size must be a perfect square";
        }
        
        // Check if solvable
        if (!isSolvable(inputBoard, size)) {
            return "Error: Puzzle is not solvable";
        }
        
        // Find empty position (0)
        auto it = std::find(inputBoard.begin(), inputBoard.end(), 0);
        if (it == inputBoard.end()) {
            return "Error: No empty space found";
        }
        int emptyPos = std::distance(inputBoard.begin(), it);
        
        // Check if already solved
        if (isGoalState(inputBoard)) {
            return "";  // No moves needed
        }
        
        // A* algorithm
        auto compare = [this](const State& a, const State& b) {
            return a.moves + calculateManhattan(a.board, a.size) > 
                   b.moves + calculateManhattan(b.board, b.size);
        };
        
        std::priority_queue<State, std::vector<State>, decltype(compare)> queue(compare);
        std::unordered_set<std::string> visited;
        
        State initialState(inputBoard, size, emptyPos, 0, "");
        queue.push(initialState);
        visited.insert(initialState.toString());
        
        while (!queue.empty()) {
            State current = queue.top();
            queue.pop();
            
            if (isGoalState(current.board)) {
                return current.path;
            }
            
            std::vector<int> possibleMoves = getPossibleMoves(current.emptyPos, size);
            
            for (int newPos : possibleMoves) {
                std::vector<int> newBoard = current.board;
                std::swap(newBoard[current.emptyPos], newBoard[newPos]);
                
                std::string key = [&newBoard]() {
                    std::stringstream ss;
                    for (int val : newBoard) {
                        ss << val << ",";
                    }
                    return ss.str();
                }();
                
                if (visited.find(key) == visited.end()) {
                    std::string direction = getMoveDirection(current.emptyPos, newPos, size);
                    State nextState(newBoard, size, newPos, current.moves + 1, current.path + direction);
                    queue.push(nextState);
                    visited.insert(key);
                }
            }
        }
        
        return "Error: No solution found";
    }

    // Check if a move is valid from the current state
    bool isValidMove(const std::vector<int>& board, const std::string& move) {
        if (board.empty() || move.empty()) {
            return false;
        }
        
        // Calculate board size
        int size = static_cast<int>(sqrt(board.size()));
        if (size * size != board.size()) {
            return false;
        }
        
        // Find empty position (0)
        auto it = std::find(board.begin(), board.end(), 0);
        if (it == board.end()) {
            return false;
        }
        int emptyPos = std::distance(board.begin(), it);
        
        int row = emptyPos / size;
        int col = emptyPos % size;
        
        // Check if the move is valid
        if (move == "U" && row > 0) return true;
        if (move == "D" && row < size - 1) return true;
        if (move == "L" && col > 0) return true;
        if (move == "R" && col < size - 1) return true;
        
        return false;
    }

    // Apply a move to the board
    std::string applyMove(const std::vector<int>& board, const std::string& move) {
        if (!isValidMove(board, move)) {
            return "Error: Invalid move";
        }
        
        std::vector<int> newBoard = board;
        
        // Calculate board size
        int size = static_cast<int>(sqrt(newBoard.size()));
        
        // Find empty position (0)
        int emptyPos = std::distance(newBoard.begin(), std::find(newBoard.begin(), newBoard.end(), 0));
        
        // Apply the move
        int newPos = emptyPos;
        if (move == "U") newPos = emptyPos - size;
        else if (move == "D") newPos = emptyPos + size;
        else if (move == "L") newPos = emptyPos - 1;
        else if (move == "R") newPos = emptyPos + 1;
        
        // Swap the empty position with the new position
        std::swap(newBoard[emptyPos], newBoard[newPos]);
        
        // Convert the board to a comma-separated string
        std::stringstream ss;
        for (size_t i = 0; i < newBoard.size(); ++i) {
            ss << newBoard[i];
            if (i < newBoard.size() - 1) {
                ss << ",";
            }
        }
        
        return ss.str();
    }

    // Get a hint (next optimal move)
    std::string getHint(const std::vector<int>& board) {
        std::string solution = solve(board);
        if (solution.empty() || solution.substr(0, 5) == "Error") {
            return solution;
        }
        
        return solution.substr(0, 1);  // Return just the first move
    }

    // Check if the board is in the goal state
    bool isComplete(const std::vector<int>& board) {
        return isGoalState(board);
    }
};

// Binding code
EMSCRIPTEN_BINDINGS(number_slider_module) {
    class_<NumberSliderEngine>("NumberSliderEngine")
        .constructor<>()
        .function("solve", &NumberSliderEngine::solve)
        .function("isValidMove", &NumberSliderEngine::isValidMove)
        .function("applyMove", &NumberSliderEngine::applyMove)
        .function("getHint", &NumberSliderEngine::getHint)
        .function("isComplete", &NumberSliderEngine::isComplete);
    
    register_vector<int>("IntVector");
}