#include <iostream>
#include <vector>
#include <stack>
#include <string>
#include <limits>
#include <algorithm>
#include <map>
#include <set>
#include <sstream>
#include <emscripten/bind.h>

using namespace std;
using namespace emscripten;

class RubiksCubeEngine {
private:
    vector<vector<vector<int>>> cube;
    vector<vector<vector<int>>> goal;
    
    vector<vector<vector<int>>> rotateRight(const vector<vector<vector<int>>>& state, bool clockwise) {
        auto result = state;
        
        if (clockwise) {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    result[4][i][j] = state[4][2-j][i];
                }
            }
            
            for (int i = 0; i < 3; i++) {
                result[0][i][2] = state[3][i][2];
                result[3][i][2] = state[5][i][2];
                result[5][i][2] = state[1][i][2];
                result[1][i][2] = state[0][i][2];
            }
        } else {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    result[4][i][j] = state[4][j][2-i];
                }
            }
            
            for (int i = 0; i < 3; i++) {
                result[0][i][2] = state[1][i][2];
                result[1][i][2] = state[5][i][2];
                result[5][i][2] = state[3][i][2];
                result[3][i][2] = state[0][i][2];
            }
        }
        
        return result;
    }
    
    vector<vector<vector<int>>> rotateLeft(const vector<vector<vector<int>>>& state, bool clockwise) {
        auto result = state;
        
        if (clockwise) {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    result[2][i][j] = state[2][2-j][i];
                }
            }
            
            for (int i = 0; i < 3; i++) {
                result[0][i][0] = state[1][i][0];
                result[1][i][0] = state[5][i][0];
                result[5][i][0] = state[3][i][0];
                result[3][i][0] = state[0][i][0];
            }
        } else {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    result[2][i][j] = state[2][j][2-i];
                }
            }
            
            for (int i = 0; i < 3; i++) {
                result[0][i][0] = state[3][i][0];
                result[3][i][0] = state[5][i][0];
                result[5][i][0] = state[1][i][0];
                result[1][i][0] = state[0][i][0];
            }
        }
        
        return result;
    }
    
    vector<vector<vector<int>>> rotateUp(const vector<vector<vector<int>>>& state, bool clockwise) {
        auto result = state;
        
        if (clockwise) {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    result[0][i][j] = state[0][2-j][i];
                }
            }
            
            for (int i = 0; i < 3; i++) {
                result[1][0][i] = state[4][0][i];
                result[4][0][i] = state[3][0][i];
                result[3][0][i] = state[2][0][i];
                result[2][0][i] = state[1][0][i];
            }
        } else {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    result[0][i][j] = state[0][j][2-i];
                }
            }
            
            for (int i = 0; i < 3; i++) {
                result[1][0][i] = state[2][0][i];
                result[2][0][i] = state[3][0][i];
                result[3][0][i] = state[4][0][i];
                result[4][0][i] = state[1][0][i];
            }
        }
        
        return result;
    }
    
    vector<vector<vector<int>>> rotateDown(const vector<vector<vector<int>>>& state, bool clockwise) {
        auto result = state;
        
        if (clockwise) {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    result[5][i][j] = state[5][2-j][i];
                }
            }
            
            for (int i = 0; i < 3; i++) {
                result[1][2][i] = state[2][2][i];
                result[2][2][i] = state[3][2][i];
                result[3][2][i] = state[4][2][i];
                result[4][2][i] = state[1][2][i];
            }
        } else {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    result[5][i][j] = state[5][j][2-i];
                }
            }
            
            for (int i = 0; i < 3; i++) {
                result[1][2][i] = state[4][2][i];
                result[4][2][i] = state[3][2][i];
                result[3][2][i] = state[2][2][i];
                result[2][2][i] = state[1][2][i];
            }
        }
        
        return result;
    }
    
    vector<vector<vector<int>>> rotateFront(const vector<vector<vector<int>>>& state, bool clockwise) {
        auto result = state;
        
        if (clockwise) {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    result[1][i][j] = state[1][2-j][i];
                }
            }
            
            for (int i = 0; i < 3; i++) {
                result[0][2][i] = state[2][2-i][2];
                result[2][i][2] = state[5][0][i];
                result[5][0][i] = state[4][2-i][0];
                result[4][i][0] = state[0][2][i];
            }
        } else {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    result[1][i][j] = state[1][j][2-i];
                }
            }
            
            for (int i = 0; i < 3; i++) {
                result[0][2][i] = state[4][i][0];
                result[4][i][0] = state[5][0][2-i];
                result[5][0][i] = state[2][i][2];
                result[2][i][2] = state[0][2][2-i];
            }
        }
        
        return result;
    }
    
    vector<vector<vector<int>>> rotateBack(const vector<vector<vector<int>>>& state, bool clockwise) {
        auto result = state;
        
        if (clockwise) {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    result[3][i][j] = state[3][2-j][i];
                }
            }
            
            for (int i = 0; i < 3; i++) {
                result[0][0][i] = state[4][i][2];
                result[4][i][2] = state[5][2][2-i];
                result[5][2][i] = state[2][i][0];
                result[2][i][0] = state[0][0][2-i];
            }
        } else {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    result[3][i][j] = state[3][j][2-i];
                }
            }
            
            for (int i = 0; i < 3; i++) {
                result[0][0][i] = state[2][2-i][0];
                result[2][i][0] = state[5][2][i];
                result[5][2][i] = state[4][2-i][2];
                result[4][i][2] = state[0][0][i];
            }
        }
        
        return result;
    }
    
    bool isSolved() {
        for (int face = 0; face < 6; face++) {
            int color = cube[face][1][1]; 
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    if (cube[face][i][j] != color) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    string moveToString(int move) {
        switch(move) {
            case 0: return "R";
            case 1: return "R'";
            case 2: return "L";
            case 3: return "L'";
            case 4: return "U";
            case 5: return "U'";
            case 6: return "D";
            case 7: return "D'";
            case 8: return "F";
            case 9: return "F'";
            case 10: return "B";
            case 11: return "B'";
            default: return "?";
        }
    }
    
    vector<vector<vector<int>>> applyMove(const vector<vector<vector<int>>>& state, int move) {
        switch(move) {
            case 0: return rotateRight(state, true);
            case 1: return rotateRight(state, false);
            case 2: return rotateLeft(state, true);
            case 3: return rotateLeft(state, false);
            case 4: return rotateUp(state, true);
            case 5: return rotateUp(state, false);
            case 6: return rotateDown(state, true);
            case 7: return rotateDown(state, false);
            case 8: return rotateFront(state, true);
            case 9: return rotateFront(state, false);
            case 10: return rotateBack(state, true);
            case 11: return rotateBack(state, false);
            default: return state;
        }
    }
    
    int heuristic() {
        int h = 0;
        for (int face = 0; face < 6; face++) {
            int center = cube[face][1][1];
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    if (cube[face][i][j] != center)
                        h++;
                }
            }
        }
        return h / 8; 
    }
    
    string idaStar(int maxDepth = 12) {
        int threshold = heuristic();
        vector<int> path;
        
        for (int depth = 0; depth <= maxDepth; depth++) {
            int t = search(0, -1, depth, path);
            if (t == 0) {
                stringstream ss;
                for (int move : path) {
                    ss << moveToString(move) << " ";
                }
                return ss.str();
            }
        }
        
        return "No solution found within depth limit";
    }
    
    int search(int g, int lastMove, int bound, vector<int>& path) {
        int h = heuristic();
        int f = g + h;
        
        if (f > bound) return f;
        if (h == 0) return 0; 
        
        int min_val = numeric_limits<int>::max();
        
        for (int move = 0; move < 12; move++) {
            if (lastMove != -1) {
                if ((lastMove/2 == move/2) && (lastMove%2 != move%2))
                    continue;
                
                if ((lastMove/2 == move/2))
                    continue;
            }
            
            auto oldCube = cube;
            cube = applyMove(cube, move);
            
            path.push_back(move);
            int t = search(g+1, move, bound, path);
            
            if (t == 0) return 0; 
            if (t < min_val) min_val = t;
            
            path.pop_back();
            cube = oldCube;
        }
        
        return min_val;
    }

public:
    RubiksCubeEngine() {
        cube = vector<vector<vector<int>>>(6, vector<vector<int>>(3, vector<int>(3, 0)));
        for (int face = 0; face < 6; face++) {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    cube[face][i][j] = face;
                }
            }
        }
        
        goal = cube; 
    }
    
    void setStartState(const vector<int>& flatState) {
        if (flatState.size() != 54) {
            return; 
        }
        
        int idx = 0;
        for (int face = 0; face < 6; face++) {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    cube[face][i][j] = flatState[idx++];
                }
            }
        }
    }
    
    void setGoalState(const vector<int>& flatGoal) {
        if (flatGoal.size() != 54) {
            return; 
        }
        
        int idx = 0;
        for (int face = 0; face < 6; face++) {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    goal[face][i][j] = flatGoal[idx++];
                }
            }
        }
    }
    
    string solve() {
        return idaStar();
    }
};

EMSCRIPTEN_BINDINGS(rubiks_module) {
    register_vector<int>("IntVector");
    
    class_<RubiksCubeEngine>("RubiksCubeEngine")
        .constructor<>()
        .function("setStartState", &RubiksCubeEngine::setStartState)
        .function("setGoalState", &RubiksCubeEngine::setGoalState)
        .function("solve", &RubiksCubeEngine::solve);
}
            return; // Invalid size
        }
        
        int idx = 0;
        for (int face = 0; face < 6; face++) {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    cube[face][i][j] = flatState[idx++];
                }
            }
        }
    }
    
    void setGoalState(const vector<int>& flatGoal) {
        if (flatGoal.size() != 54) {
            return; // Invalid size
        }
        
        int idx = 0;
        for (int face = 0; face < 6; face++) {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    goal[face][i][j] = flatGoal[idx++];
                }
            }
        }
    }
    
    string solve() {
        return idaStar();
    }
};

// Binding code
EMSCRIPTEN_BINDINGS(rubiks_module) {
    register_vector<int>("IntVector");
    
    class_<RubiksCubeEngine>("RubiksCubeEngine")
        .constructor<>()
        .function("setStartState", &RubiksCubeEngine::setStartState)
        .function("setGoalState", &RubiksCubeEngine::setGoalState)
        .function("solve", &RubiksCubeEngine::solve);
}