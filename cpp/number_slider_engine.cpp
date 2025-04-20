#include <iostream>
#include <vector>
#include <string>
#include <unordered_set>
#include <climits>
#include <algorithm>
using namespace std;

// Class representing a state of the puzzle
class Node
{
private:
    static const int N = 4;      // Size of the puzzle (4x4)
    vector<vector<int>> board;   // Current state of the puzzle board
    int g;                       // Cost from start (number of moves made)
    int h;                       // Heuristic estimate (estimated cost to reach goal)
    int zero_row, zero_col;      // Position of the empty tile (zero)
    vector<pair<int, int>> path; // Move history (positions of the empty tile)
    int last_move;               // Last move direction index

    // Finds the position of the empty tile (zero) in the board
    void findZero()
    {
        for (int i = 0; i < N; ++i)
            for (int j = 0; j < N; ++j)
                if (board[i][j] == 0)
                {
                    zero_row = i;
                    zero_col = j;
                    return;
                }
    }

    // Computes the heuristic value for the current board state
    // Includes Manhattan distance and linear conflict detection
    int computeHeuristic() const
    {
        int dist = 0;
        int conflicts = 0;

        // Calculate Manhattan distance
        for (int i = 0; i < N; ++i)
        {
            for (int j = 0; j < N; ++j)
            {
                if (board[i][j] != 0)
                {
                    int target_row = (board[i][j] - 1) / N;
                    int target_col = (board[i][j] - 1) % N;
                    dist += abs(i - target_row) + abs(j - target_col);
                }
            }
        }

        // Calculate linear conflicts
        for (int i = 0; i < N; ++i)
        {
            for (int j = 0; j < N; ++j)
            {
                if (board[i][j] != 0)
                {
                    for (int k = j + 1; k < N; ++k)
                    {
                        if (board[i][k] != 0 && board[i][j] > board[i][k])
                        {
                            conflicts += 2;
                        }
                    }
                }
            }
        }

        return dist + conflicts; // Return total heuristic value
    }

public:
    Node(const vector<vector<int>> &b, int g_, const vector<pair<int, int>> &p, int last_move_ = -1)
        : board(b), g(g_), path(p), last_move(last_move_)
    {
        h = computeHeuristic(); // Compute heuristic value upon initialization
        findZero();             // Locate the empty tile
    }

    bool isGoal() const
    {
        int count = 1;
        for (int i = 0; i < N; ++i)
            for (int j = 0; j < N; ++j)
                if (i == N - 1 && j == N - 1) {
                    if (board[i][j] != 0) return false; // Last tile must be zero
                } else {
                    if (board[i][j] != count++) return false; // Tiles must be in order
                }
        return true; // All checks passed, it's the goal state
    }

    int f() const
    {
        return g + h;
    }

    string serialize() const
    {
        string key;
        for (const auto& row : board) {
            for (int val : row) {
                key += to_string(val) + ",";
            }
        }
        return key;
    }

    const vector<vector<int>> &getBoard() const { return board; }
    int getZeroRow() const { return zero_row; }
    int getZeroCol() const { return zero_col; }
    const vector<pair<int, int>> &getPath() const { return path; }
    int getLastMove() const { return last_move; }
    int getG() const { return g; }
    friend class FifteenPuzzleSolver; // Grant access to the solver
};

// Class responsible for solving the 15-puzzle problem
class FifteenPuzzleSolver
{
private:
    static const int N = 4;                                                       // Size of the puzzle (4x4)
    const vector<pair<int, int>> directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}}; // Possible move directions (Up, Down, Left, Right)

    bool isSolvable(const vector<vector<int>> &board) const
    {
        vector<int> flat; // Flattened representation of the board
        int row_with_zero = 0; // Row index of the empty tile
        for (int i = 0; i < N; ++i)
            for (int j = 0; j < N; ++j) {
                if (board[i][j] == 0) row_with_zero = i; // Record the row of zero
                else flat.push_back(board[i][j]); // Add non-zero tiles to the flat vector
            }

        int inversions = 0; // Count of inversions
        for (int i = 0; i < flat.size(); ++i)
            for (int j = i + 1; j < flat.size(); ++j)
                if (flat[i] > flat[j])
                    ++inversions; // Increment inversions count

        int row_from_bottom = N - row_with_zero; // Calculate row index from the bottom
        // Determine solvability based on inversions and row position of zero
        return (row_from_bottom % 2 == 0) ? inversions % 2 == 1 : inversions % 2 == 0;
    }

    int IDA_dfs(Node &node, int threshold, int &next_threshold, int last_move, unordered_set<string> &visited) const
    {
        int f = node.f(); // Calculate the cost function
        if (f > threshold) {
            next_threshold = min(next_threshold, f); // Update next threshold if necessary
            return -1; // Return -1 to indicate threshold exceeded
        }

        // Check if the current node is the goal state
        if (node.isGoal()) {
            cout << "Solved in " << node.getG() << " moves.\n"; // Output the number of moves
            for (const auto& p : node.getPath())
                cout << "(" << p.first << "," << p.second << ") "; // Output the path taken
            cout << "\n";
            return node.getG(); // Return the number of moves to goal
        }

        string serialized_board = node.serialize(); // Serialize the current board state
        if (visited.count(serialized_board)) {
            return -1; // Return -1 if this state has already been visited
        }
        visited.insert(serialized_board); // Mark this state as visited

        for (int i = 0; i < directions.size(); ++i) {
            // Skip the opposite of the last move to prevent reversing
            if (last_move != -1) {
                if ((last_move == 0 && i == 1) || // Up -> skip Down
                    (last_move == 1 && i == 0) || // Down -> skip Up
                    (last_move == 2 && i == 3) || // Left -> skip Right
                    (last_move == 3 && i == 2)) { // Right -> skip Left
                    continue; // Skip this direction
                }
            }

            // Calculate the new position of the zero tile after the move
            int ni = node.getZeroRow() + directions[i].first;
            int nj = node.getZeroCol() + directions[i].second;

            // Check if the new position is within bounds
            if (ni >= 0 && ni < N && nj >= 0 && nj < N) {
                vector<vector<int>> newBoard = node.getBoard(); // Create a new board state
                swap(newBoard[node.getZeroRow()][node.getZeroCol()], newBoard[ni][nj]); // Perform the move
                vector<pair<int, int>> newPath = node.getPath(); // Copy the path
                newPath.emplace_back(ni, nj); // Add the new position to the path
                Node next(newBoard, node.getG() + 1, newPath, i); // Create the next node
                int result = IDA_dfs(next, threshold, next_threshold, i, visited); // Recur
                if (result != -1)
                    return result; // Return the result if found
            }
        }
        visited.erase(serialized_board); // Backtrack: unmark this state
        return -1; // Return -1 if no solution found in this path
    }

public:
    // Public interface to solve the puzzle
    void solve(const vector<vector<int>> &board)
    {
        if (!isSolvable(board))
        {
            cout << "Puzzle is not solvable.\n"; // Output if the puzzle is unsolvable
            return;
        }

        Node start(board, 0, {});      // Initialize the starting node
        int threshold = start.f();     // Set the initial threshold
        unordered_set<string> visited; // Set to track visited states

        while (true)
        {
            int next_threshold = INT_MAX;                                        // Initialize next threshold
            int result = IDA_dfs(start, threshold, next_threshold, -1, visited); // Start the search
            if (result != -1)
                return; // Solution found
            if (next_threshold == INT_MAX)
            {
                cout << "No solution found.\n"; // Output if no solution exists
                return;
            }
            threshold = next_threshold; // Update the threshold for the next iteration
        }
    }
};

int main(int argc, char *argv[])
{
    vector<vector<int>> board;
    
    if (argc >= 17)
    { // 16 board values + 1 for program name
        board.resize(4, vector<int>(4));
        for (int i = 0; i < 16; ++i)
        {
            board[i / 4][i % 4] = stoi(argv[i + 1]);
        }
    }
    else
    {
        // Use the default board if no arguments are provided
        board = {
            {7, 13, 9, 12},
            {8, 14, 5, 11},
            {3, 2, 1, 15},
            {0, 10, 6, 4}
        };
        cerr << "Using default board. For custom board: " << argv[0] << " <16 board values>" << endl;
    }

    FifteenPuzzleSolver solver; // Create a solver instance
    solver.solve(board);        // Solve the puzzle

    return 0;
}
