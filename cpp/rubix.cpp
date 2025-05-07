#include <iostream>
#include <fstream>
#include <stack>
#include <vector>
#include <limits>
#include <algorithm>
#include <map>
#include <string>
#include <numeric>
#include <set>

using namespace std;

void takeInput(int ***startState, int ***finalState, int argc, char *argv[])
{
    if (argc > 1 && (argc - 1) >= 108)
    {
        int argIndex = 1;
        for (int i = 0; i < 6; i++)
        {
            for (int j = 0; j < 3; j++)
            {
                for (int k = 0; k < 3; k++)
                {
                    startState[i][j][k] = atoi(argv[argIndex++]);
                }
            }
        }
        for (int i = 0; i < 6; i++)
        {
            for (int j = 0; j < 3; j++)
            {
                for (int k = 0; k < 3; k++)
                {
                    finalState[i][j][k] = atoi(argv[argIndex++]);
                }
            }
        }
    }
    else
    {
        int defaultStartState[54] = {
            0, 0, 0, 0, 0, 1, 0, 2, 0,
            1, 1, 1, 1, 1, 2, 1, 0, 1,
            2, 2, 2, 2, 2, 2, 2, 3, 2,
            3, 3, 3, 3, 3, 3, 0, 3, 3,
            4, 4, 4, 4, 4, 4, 4, 4, 1,
            5, 5, 5, 5, 5, 5, 5, 5, 5};
        int defaultFinalState[54] = {
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            1, 1, 1, 1, 1, 1, 1, 1, 1,
            2, 2, 2, 2, 2, 2, 2, 2, 2,
            3, 3, 3, 3, 3, 3, 3, 3, 3,
            4, 4, 4, 4, 4, 4, 4, 4, 4,
            5, 5, 5, 5, 5, 5, 5, 5, 5};
        int startIdx = 0;
        int finalIdx = 0;
        for (int i = 0; i < 6; i++)
        {
            for (int j = 0; j < 3; j++)
            {
                for (int k = 0; k < 3; k++)
                {
                    startState[i][j][k] = defaultStartState[startIdx++];
                    finalState[i][j][k] = defaultFinalState[finalIdx++];
                }
            }
        }
        cout << "Using default input values." << endl;
    }
}

void print(int ***arr)
{
    cout << "Printing " << endl;
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            for (int k = 0; k < 3; k++)
            {
                cout << arr[i][j][k];
            }
            cout << endl;
        }
        cout << endl;
    }
    cout << endl;
}

int ***rightAntiClock(int ***cube)
{
    int ***temp;
    temp = new int **[6];
    for (int i = 0; i < 6; i++)
    {
        temp[i] = new int *[3];
        for (int j = 0; j < 3; j++)
        {
            temp[i][j] = new int[3];
        }
    }
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            for (int k = 0; k < 3; k++)
            {
                temp[i][j][k] = cube[i][j][k];
            }
        }
    }
    temp[4][0][1] = cube[4][1][0];
    temp[4][1][0] = cube[4][2][1];
    temp[4][2][1] = cube[4][1][2];
    temp[4][1][2] = cube[4][0][1];
    temp[4][0][0] = cube[4][2][0];
    temp[4][2][0] = cube[4][2][2];
    temp[4][2][2] = cube[4][0][2];
    temp[4][0][2] = cube[4][0][0];
    temp[0][0][2] = cube[3][0][2];
    temp[0][1][2] = cube[3][1][2];
    temp[0][2][2] = cube[3][2][2];
    temp[3][0][2] = cube[5][0][2];
    temp[3][1][2] = cube[5][1][2];
    temp[3][2][2] = cube[5][2][2];
    temp[5][0][2] = cube[1][0][2];
    temp[5][1][2] = cube[1][1][2];
    temp[5][2][2] = cube[1][2][2];
    temp[1][0][2] = cube[0][0][2];
    temp[1][1][2] = cube[0][1][2];
    temp[1][2][2] = cube[0][2][2];
    return temp;
}

int ***rightClock(int ***cube)
{
    int ***temp;
    temp = new int **[6];
    for (int i = 0; i < 6; i++)
    {
        temp[i] = new int *[3];
        for (int j = 0; j < 3; j++)
        {
            temp[i][j] = new int[3];
        }
    }
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            for (int k = 0; k < 3; k++)
            {
                temp[i][j][k] = cube[i][j][k];
            }
        }
    }
    temp[4][0][1] = cube[4][1][2];
    temp[4][1][0] = cube[4][0][1];
    temp[4][2][1] = cube[4][1][0];
    temp[4][1][2] = cube[4][2][1];
    temp[4][0][0] = cube[4][0][2];
    temp[4][2][0] = cube[4][0][0];
    temp[4][2][2] = cube[4][2][0];
    temp[4][0][2] = cube[4][2][2];
    temp[0][0][2] = cube[1][0][2];
    temp[0][1][2] = cube[1][1][2];
    temp[0][2][2] = cube[1][2][2];
    temp[3][0][2] = cube[0][0][2];
    temp[3][1][2] = cube[0][1][2];
    temp[3][2][2] = cube[0][2][2];
    temp[5][0][2] = cube[3][0][2];
    temp[5][1][2] = cube[3][1][2];
    temp[5][2][2] = cube[3][2][2];
    temp[1][0][2] = cube[5][0][2];
    temp[1][1][2] = cube[5][1][2];
    temp[1][2][2] = cube[5][2][2];
    return temp;
}

int ***upClock(int ***cube)
{
    int ***temp;
    temp = new int **[6];
    for (int i = 0; i < 6; i++)
    {
        temp[i] = new int *[3];
        for (int j = 0; j < 3; j++)
        {
            temp[i][j] = new int[3];
        }
    }
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            for (int k = 0; k < 3; k++)
            {
                temp[i][j][k] = cube[i][j][k];
            }
        }
    }
    temp[0][0][1] = cube[0][1][2];
    temp[0][1][0] = cube[0][0][1];
    temp[0][2][1] = cube[0][1][0];
    temp[0][1][2] = cube[0][2][1];
    temp[0][0][0] = cube[0][0][2];
    temp[0][2][0] = cube[0][0][0];
    temp[0][2][2] = cube[0][2][0];
    temp[0][0][2] = cube[0][2][2];
    temp[2][0][0] = cube[1][0][0];
    temp[2][1][0] = cube[1][1][0];
    temp[2][2][0] = cube[1][2][0];
    temp[3][0][0] = cube[2][0][0];
    temp[3][1][0] = cube[2][1][0];
    temp[3][2][0] = cube[2][2][0];
    temp[4][0][0] = cube[3][0][0];
    temp[4][1][0] = cube[3][1][0];
    temp[4][2][0] = cube[3][2][0];
    temp[1][0][0] = cube[4][0][0];
    temp[1][1][0] = cube[4][1][0];
    temp[1][2][0] = cube[4][2][0];
    return temp;
}

int ***upAntiClock(int ***cube)
{
    int ***temp;
    temp = new int **[6];
    for (int i = 0; i < 6; i++)
    {
        temp[i] = new int *[3];
        for (int j = 0; j < 3; j++)
        {
            temp[i][j] = new int[3];
        }
    }
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            for (int k = 0; k < 3; k++)
            {
                temp[i][j][k] = cube[i][j][k];
            }
        }
    }
    temp[0][0][1] = cube[0][1][0];
    temp[0][1][0] = cube[0][2][1];
    temp[0][2][1] = cube[0][1][2];
    temp[0][1][2] = cube[0][0][1];
    temp[0][0][0] = cube[0][2][0];
    temp[0][2][0] = cube[0][2][2];
    temp[0][2][2] = cube[0][0][2];
    temp[0][0][2] = cube[0][0][0];
    temp[2][0][0] = cube[3][0][0];
    temp[2][1][0] = cube[3][1][0];
    temp[2][2][0] = cube[3][2][0];
    temp[3][0][0] = cube[4][0][0];
    temp[3][1][0] = cube[4][1][0];
    temp[3][2][0] = cube[4][2][0];
    temp[4][0][0] = cube[1][0][0];
    temp[4][1][0] = cube[1][1][0];
    temp[4][2][0] = cube[1][2][0];
    temp[1][0][0] = cube[2][0][0];
    temp[1][1][0] = cube[2][1][0];
    temp[1][2][0] = cube[2][2][0];
    return temp;
}

int ***leftClock(int ***cube)
{
    int ***temp;
    temp = new int **[6];
    for (int i = 0; i < 6; i++)
    {
        temp[i] = new int *[3];
        for (int j = 0; j < 3; j++)
        {
            temp[i][j] = new int[3];
        }
    }
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            for (int k = 0; k < 3; k++)
            {
                temp[i][j][k] = cube[i][j][k];
            }
        }
    }
    temp[2][0][1] = cube[2][1][0];
    temp[2][1][0] = cube[2][2][1];
    temp[2][2][1] = cube[2][1][2];
    temp[2][1][2] = cube[2][0][1];
    temp[2][0][0] = cube[2][2][0];
    temp[2][2][0] = cube[2][2][2];
    temp[2][2][2] = cube[2][0][2];
    temp[2][0][2] = cube[2][0][0];
    temp[0][0][0] = cube[3][0][0];
    temp[0][1][0] = cube[3][1][0];
    temp[0][2][0] = cube[3][2][0];
    temp[3][0][0] = cube[5][0][0];
    temp[3][1][0] = cube[5][1][0];
    temp[3][2][0] = cube[5][2][0];
    temp[5][0][0] = cube[1][0][0];
    temp[5][1][0] = cube[1][1][0];
    temp[5][2][0] = cube[1][2][0];
    temp[1][0][0] = cube[0][0][0];
    temp[1][1][0] = cube[0][1][0];
    temp[1][2][0] = cube[0][2][0];
    return temp;
}

int ***leftAntiClock(int ***cube)
{
    int ***temp;
    temp = new int **[6];
    for (int i = 0; i < 6; i++)
    {
        temp[i] = new int *[3];
        for (int j = 0; j < 3; j++)
        {
            temp[i][j] = new int[3];
        }
    }
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            for (int k = 0; k < 3; k++)
            {
                temp[i][j][k] = cube[i][j][k];
            }
        }
    }
    temp[2][0][1] = cube[2][1][2];
    temp[2][1][0] = cube[2][0][1];
    temp[2][2][1] = cube[2][1][0];
    temp[2][1][2] = cube[2][2][1];
    temp[2][0][0] = cube[2][0][2];
    temp[2][2][0] = cube[2][0][0];
    temp[2][2][2] = cube[2][2][0];
    temp[2][0][2] = cube[2][2][2];
    temp[0][0][0] = cube[1][0][0];
    temp[0][1][0] = cube[1][1][0];
    temp[0][2][0] = cube[1][2][0];
    temp[3][0][0] = cube[0][0][0];
    temp[3][1][0] = cube[0][1][0];
    temp[3][2][0] = cube[0][2][0];
    temp[5][0][0] = cube[3][0][0];
    temp[5][1][0] = cube[3][1][0];
    temp[5][2][0] = cube[3][2][0];
    temp[1][0][0] = cube[5][0][0];
    temp[1][1][0] = cube[5][1][0];
    temp[1][2][0] = cube[5][2][0];
    return temp;
}

int ***downClock(int ***cube)
{
    int ***temp;
    temp = new int **[6];
    for (int i = 0; i < 6; i++)
    {
        temp[i] = new int *[3];
        for (int j = 0; j < 3; j++)
        {
            temp[i][j] = new int[3];
        }
    }
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            for (int k = 0; k < 3; k++)
            {
                temp[i][j][k] = cube[i][j][k];
            }
        }
    }
    temp[5][0][1] = cube[5][1][0];
    temp[5][1][0] = cube[5][2][1];
    temp[5][2][1] = cube[5][1][2];
    temp[5][1][2] = cube[5][0][1];
    temp[5][0][0] = cube[5][2][0];
    temp[5][2][0] = cube[5][2][2];
    temp[5][2][2] = cube[5][0][2];
    temp[5][0][2] = cube[5][0][0];
    temp[2][0][2] = cube[3][0][2];
    temp[2][1][2] = cube[3][1][2];
    temp[2][2][2] = cube[3][2][2];
    temp[3][0][2] = cube[4][0][2];
    temp[3][1][2] = cube[4][1][2];
    temp[3][2][2] = cube[4][2][2];
    temp[4][0][2] = cube[1][0][2];
    temp[4][1][2] = cube[1][1][2];
    temp[4][2][2] = cube[1][2][2];
    temp[1][0][2] = cube[2][0][2];
    temp[1][1][2] = cube[2][1][2];
    temp[1][2][2] = cube[2][2][2];
    return temp;
}

int ***downAntiClock(int ***cube)
{
    int ***temp;
    temp = new int **[6];
    for (int i = 0; i < 6; i++)
    {
        temp[i] = new int *[3];
        for (int j = 0; j < 3; j++)
        {
            temp[i][j] = new int[3];
        }
    }
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            for (int k = 0; k < 3; k++)
            {
                temp[i][j][k] = cube[i][j][k];
            }
        }
    }
    temp[5][0][1] = cube[5][1][2];
    temp[5][1][0] = cube[5][0][1];
    temp[5][2][1] = cube[5][1][0];
    temp[5][1][2] = cube[5][2][1];
    temp[5][0][0] = cube[5][0][2];
    temp[5][2][0] = cube[5][0][0];
    temp[5][2][2] = cube[5][2][0];
    temp[5][0][2] = cube[5][2][2];
    temp[2][0][2] = cube[1][0][2];
    temp[2][1][2] = cube[1][1][2];
    temp[2][2][2] = cube[1][2][2];
    temp[3][0][2] = cube[2][0][2];
    temp[3][1][2] = cube[2][1][2];
    temp[3][2][2] = cube[2][2][2];
    temp[4][0][2] = cube[3][0][2];
    temp[4][1][2] = cube[3][1][2];
    temp[4][2][2] = cube[3][2][2];
    temp[1][0][2] = cube[4][0][2];
    temp[1][1][2] = cube[4][1][2];
    temp[1][2][2] = cube[4][2][2];
    return temp;
}

int ***frontClock(int ***cube)
{
    int ***temp;
    temp = new int **[6];
    for (int i = 0; i < 6; i++)
    {
        temp[i] = new int *[3];
        for (int j = 0; j < 3; j++)
        {
            temp[i][j] = new int[3];
        }
    }
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            for (int k = 0; k < 3; k++)
            {
                temp[i][j][k] = cube[i][j][k];
            }
        }
    }
    temp[1][0][1] = cube[1][1][2];
    temp[1][1][0] = cube[1][0][1];
    temp[1][2][1] = cube[1][1][0];
    temp[1][1][2] = cube[1][2][1];
    temp[1][0][0] = cube[1][0][2];
    temp[1][2][0] = cube[1][0][0];
    temp[1][2][2] = cube[1][2][0];
    temp[1][0][2] = cube[1][2][2];
    temp[0][2][0] = cube[2][2][2];
    temp[0][2][1] = cube[2][1][2];
    temp[0][2][2] = cube[2][0][2];
    temp[4][0][0] = cube[0][2][2];
    temp[4][1][0] = cube[0][2][1];
    temp[4][2][0] = cube[0][2][0];
    temp[5][0][2] = cube[4][0][0];
    temp[5][0][1] = cube[4][1][0];
    temp[5][0][0] = cube[4][2][0];
    temp[2][0][2] = cube[5][0][0];
    temp[2][1][2] = cube[5][0][1];
    temp[2][2][2] = cube[5][0][2];
    return temp;
}

int ***frontAntiClock(int ***cube)
{
    int ***temp;
    temp = new int **[6];
    for (int i = 0; i < 6; i++)
    {
        temp[i] = new int *[3];
        for (int j = 0; j < 3; j++)
        {
            temp[i][j] = new int[3];
        }
    }
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            for (int k = 0; k < 3; k++)
            {
                temp[i][j][k] = cube[i][j][k];
            }
        }
    }
    temp[1][0][1] = cube[1][1][0];
    temp[1][1][0] = cube[1][2][1];
    temp[1][2][1] = cube[1][1][2];
    temp[1][1][2] = cube[1][0][1];
    temp[1][0][0] = cube[1][2][0];
    temp[1][2][0] = cube[1][2][2];
    temp[1][2][2] = cube[1][0][2];
    temp[1][0][2] = cube[1][0][0];
    temp[0][2][2] = cube[4][0][0];
    temp[0][2][1] = cube[4][1][0];
    temp[0][2][0] = cube[4][2][0];
    temp[2][0][2] = cube[0][2][2];
    temp[2][1][2] = cube[0][2][1];
    temp[2][2][2] = cube[0][2][0];
    temp[5][0][0] = cube[2][0][2];
    temp[5][0][1] = cube[2][1][2];
    temp[5][0][2] = cube[2][2][2];
    temp[4][2][0] = cube[5][0][2];
    temp[4][1][0] = cube[5][0][1];
    temp[4][0][0] = cube[5][0][0];
    return temp;
}

int ***backClock(int ***cube)
{
    int ***temp;
    temp = new int **[6];
    for (int i = 0; i < 6; i++)
    {
        temp[i] = new int *[3];
        for (int j = 0; j < 3; j++)
        {
            temp[i][j] = new int[3];
        }
    }
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            for (int k = 0; k < 3; k++)
            {
                temp[i][j][k] = cube[i][j][k];
            }
        }
    }
    temp[3][0][1] = cube[3][1][0];
    temp[3][1][0] = cube[3][2][1];
    temp[3][2][1] = cube[3][1][2];
    temp[3][1][2] = cube[3][0][1];
    temp[3][0][0] = cube[3][2][0];
    temp[3][2][0] = cube[3][2][2];
    temp[3][2][2] = cube[3][0][2];
    temp[3][0][2] = cube[3][0][0];
    temp[0][0][0] = cube[4][2][2];
    temp[0][0][1] = cube[4][1][2];
    temp[0][0][2] = cube[4][0][2];
    temp[2][2][0] = cube[0][0][0];
    temp[2][1][0] = cube[0][0][1];
    temp[2][0][0] = cube[0][0][2];
    temp[5][2][2] = cube[2][0][0];
    temp[5][2][1] = cube[2][1][0];
    temp[5][2][0] = cube[2][2][0];
    temp[4][0][2] = cube[5][2][2];
    temp[4][1][2] = cube[5][2][1];
    temp[4][2][2] = cube[5][2][0];
    return temp;
}

int ***backAntiClock(int ***cube)
{
    int ***temp;
    temp = new int **[6];
    for (int i = 0; i < 6; i++)
    {
        temp[i] = new int *[3];
        for (int j = 0; j < 3; j++)
        {
            temp[i][j] = new int[3];
        }
    }
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            for (int k = 0; k < 3; k++)
            {
                temp[i][j][k] = cube[i][j][k];
            }
        }
    }
    temp[3][0][1] = cube[3][1][2];
    temp[3][1][0] = cube[3][0][1];
    temp[3][2][1] = cube[3][1][0];
    temp[3][1][2] = cube[3][2][1];
    temp[3][0][0] = cube[3][0][2];
    temp[3][2][0] = cube[3][0][0];
    temp[3][2][2] = cube[3][2][0];
    temp[3][0][2] = cube[3][2][2];
    temp[0][0][2] = cube[2][0][0];
    temp[0][0][1] = cube[2][1][0];
    temp[0][0][0] = cube[2][2][0];
    temp[4][0][2] = cube[0][0][2];
    temp[4][1][2] = cube[0][0][1];
    temp[4][2][2] = cube[0][0][0];
    temp[5][2][0] = cube[4][2][2];
    temp[5][2][1] = cube[4][1][2];
    temp[5][2][2] = cube[4][0][2];
    temp[2][2][0] = cube[5][2][2];
    temp[2][1][0] = cube[5][2][1];
    temp[2][0][0] = cube[5][2][0];
    return temp;
}

struct Vec3D
{
    int x, y, z;
    bool operator<(const Vec3D &other) const
    {
        if (x != other.x)
            return x < other.x;
        if (y != other.y)
            return y < other.y;
        return z < other.z;
    }
    bool operator==(const Vec3D &other) const
    {
        return x == other.x && y == other.y && z == other.z;
    }
};

struct CubieDefinition
{
    string name;
    bool is_corner;
    set<int> solved_color_set;
    Vec3D solved_coord;
    vector<tuple<int, int, int>> slot_sticker_indices;
};

vector<CubieDefinition> all_cubie_definitions;
map<set<int>, Vec3D> solved_color_set_to_solved_coord;

int manhattan_distance(const Vec3D &c1, const Vec3D &c2)
{
    return abs(c1.x - c2.x) + abs(c1.y - c2.y) + abs(c1.z - c2.z);
}

set<int> get_colors_in_slot(int ***current_state, const vector<tuple<int, int, int>> &sticker_indices)
{
    set<int> colors;
    for (const auto &loc : sticker_indices)
    {
        colors.insert(current_state[get<0>(loc)][get<1>(loc)][get<2>(loc)]);
    }
    return colors;
}

void initialize_cubie_definitions_and_map(int ***solved_reference_state)
{
    all_cubie_definitions.clear();
    solved_color_set_to_solved_coord.clear();

    CubieDefinition defs[] = {
        {"UFR", true, {}, {1, 1, 1}, {{0, 2, 2}, {1, 0, 2}, {4, 0, 0}}},
        {"UFL", true, {}, {-1, 1, 1}, {{0, 2, 0}, {1, 0, 0}, {2, 0, 2}}},
        {"UBL", true, {}, {-1, 1, -1}, {{0, 0, 0}, {2, 0, 0}, {3, 0, 2}}},
        {"UBR", true, {}, {1, 1, -1}, {{0, 0, 2}, {3, 0, 0}, {4, 0, 2}}},
        {"DFR", true, {}, {1, -1, 1}, {{5, 0, 2}, {1, 2, 2}, {4, 2, 0}}},
        {"DFL", true, {}, {-1, -1, 1}, {{5, 0, 0}, {1, 2, 0}, {2, 2, 2}}},
        {"DBL", true, {}, {-1, -1, -1}, {{5, 2, 0}, {2, 2, 0}, {3, 2, 2}}},
        {"DBR", true, {}, {1, -1, -1}, {{5, 2, 2}, {3, 2, 0}, {4, 2, 2}}},
        {"UF", false, {}, {0, 1, 1}, {{0, 2, 1}, {1, 0, 1}}},
        {"UL", false, {}, {-1, 1, 0}, {{0, 1, 0}, {2, 0, 1}}},
        {"UB", false, {}, {0, 1, -1}, {{0, 0, 1}, {3, 0, 1}}},
        {"UR", false, {}, {1, 1, 0}, {{0, 1, 2}, {4, 0, 1}}},
        {"FL", false, {}, {-1, 0, 1}, {{1, 1, 0}, {2, 1, 2}}},
        {"FR", false, {}, {1, 0, 1}, {{1, 1, 2}, {4, 1, 0}}},
        {"BL", false, {}, {-1, 0, -1}, {{3, 1, 2}, {2, 1, 0}}},
        {"BR", false, {}, {1, 0, -1}, {{3, 1, 0}, {4, 1, 2}}},
        {"DF", false, {}, {0, -1, 1}, {{5, 0, 1}, {1, 2, 1}}},
        {"DL", false, {}, {-1, -1, 0}, {{5, 1, 0}, {2, 2, 1}}},
        {"DB", false, {}, {0, -1, -1}, {{5, 2, 1}, {3, 2, 1}}},
        {"DR", false, {}, {1, -1, 0}, {{5, 1, 2}, {4, 2, 1}}},
    };

    for (auto &def : defs)
    {
        def.solved_color_set = get_colors_in_slot(solved_reference_state, def.slot_sticker_indices);
        all_cubie_definitions.push_back(def);
        solved_color_set_to_solved_coord[def.solved_color_set] = def.solved_coord;
    }
    cout << "Manhattan heuristic cubie definitions initialized: " << all_cubie_definitions.size() << " cubies." << endl;
}

int heuristic_manhattan_rewards(int ***current_state, int ***final_state_ref_for_init_only_if_needed)
{
    if (all_cubie_definitions.empty())
    {
        initialize_cubie_definitions_and_map(final_state_ref_for_init_only_if_needed);
    }

    long long sum_corner_manhattan_dist = 0;
    long long sum_edge_manhattan_dist = 0;

    for (const auto &cubie_slot_def : all_cubie_definitions)
    {
        set<int> colors_in_current_slot = get_colors_in_slot(current_state, cubie_slot_def.slot_sticker_indices);
        auto it = solved_color_set_to_solved_coord.find(colors_in_current_slot);
        if (it != solved_color_set_to_solved_coord.end())
        {
            Vec3D piece_home_coord = it->second;
            Vec3D current_slot_coord = cubie_slot_def.solved_coord;
            int dist = manhattan_distance(current_slot_coord, piece_home_coord);
            if (cubie_slot_def.is_corner)
            {
                sum_corner_manhattan_dist += dist;
            }
            else
            {
                sum_edge_manhattan_dist += dist;
            }
        }
    }
    return max(sum_corner_manhattan_dist, sum_edge_manhattan_dist);
}

int ***getCube()
{
    int ***temp;
    temp = new int **[6];
    for (int i = 0; i < 6; i++)
    {
        temp[i] = new int *[3];
        for (int j = 0; j < 3; j++)
        {
            temp[i][j] = new int[3];
        }
    }
    return temp;
}

class node
{
public:
    int ***curr;
    int prevMove;

    node()
    {
        prevMove = 0;
        curr = getCube();
    }

    ~node()
    {
        if (curr != nullptr)
        {
            for (int i = 0; i < 6; ++i)
            {
                if (curr[i] != nullptr)
                {
                    for (int j = 0; j < 3; ++j)
                    {
                        delete[] curr[i][j];
                    }
                    delete[] curr[i];
                }
            }
            delete[] curr;
            curr = nullptr;
        }
    }

    void setCurrState(int ***c)
    {
        for (int i = 0; i < 6; i++)
        {
            for (int j = 0; j < 3; j++)
            {
                for (int k = 0; k < 3; k++)
                {
                    curr[i][j][k] = c[i][j][k];
                }
            }
        }
    }
};

typedef int ***(*MoveFunction)(int ***);
MoveFunction move_functions[] = {
    leftClock, leftAntiClock, rightClock, rightAntiClock,
    upClock, upAntiClock, downClock, downAntiClock,
    frontClock, frontAntiClock, backClock, backAntiClock};

int ida_star_search_step(node *current_node, int g_cost, int cost_limit,
                         int ***final_state, stack<int> &path_so_far, stack<int> &solution_path_ref)
{
    int h_cost = heuristic_manhattan_rewards(current_node->curr, final_state);
    int f_cost = g_cost + h_cost;

    if (f_cost > cost_limit)
    {
        return f_cost;
    }

    if (heuristic_manhattan_rewards(current_node->curr, final_state) == 0)
    {
        solution_path_ref = path_so_far;
        return 0;
    }

    int min_next_f_cost_candidate = numeric_limits<int>::max();

    for (int move_idx = 0; move_idx < 12; ++move_idx)
    {
        int current_move_id = move_idx + 1;

        if (current_node->prevMove != 0)
        {
            bool is_inverse_pair = false;
            if ((current_node->prevMove % 2 == 1 && current_move_id == current_node->prevMove + 1) ||
                (current_node->prevMove % 2 == 0 && current_move_id == current_node->prevMove - 1))
            {
                is_inverse_pair = true;
            }
            if (is_inverse_pair)
            {
                continue;
            }
        }

        node *next_node = new node();
        next_node->curr = move_functions[move_idx](current_node->curr);
        next_node->prevMove = current_move_id;

        path_so_far.push(current_move_id);
        int result = ida_star_search_step(next_node, g_cost + 1, cost_limit,
                                          final_state, path_so_far, solution_path_ref);
        path_so_far.pop();

        delete next_node;

        if (result == 0)
        {
            return 0;
        }
        if (result < min_next_f_cost_candidate)
        {
            min_next_f_cost_candidate = result;
        }
    }
    return min_next_f_cost_candidate;
}

void printSolutionInOrder(stack<int> s)
{
    if (s.empty())
    {
        cout << "No moves in solution (already solved or no solution found)." << endl;
        return;
    }
    vector<int> moves_vec;
    while (!s.empty())
    {
        moves_vec.push_back(s.top());
        s.pop();
    }
    for (int i = moves_vec.size() - 1; i >= 0; --i)
    {
        int p = moves_vec[i];
        if (p == 1)
        {
            cout << "move Left ClockWise" << endl;
        }
        else if (p == 2)
        {
            cout << "move Left AntiClockWise" << endl;
        }
        else if (p == 3)
        {
            cout << "move Right ClockWise" << endl;
        }
        else if (p == 4)
        {
            cout << "move Right AntiClockWise" << endl;
        }
        else if (p == 5)
        {
            cout << "move Up ClockWise" << endl;
        }
        else if (p == 6)
        {
            cout << "move Up AntiClockWise" << endl;
        }
        else if (p == 7)
        {
            cout << "move Down ClockWise" << endl;
        }
        else if (p == 8)
        {
            cout << "move Down AntiClockWise" << endl;
        }
        else if (p == 9)
        {
            cout << "move Front ClockWise" << endl;
        }
        else if (p == 10)
        {
            cout << "move Front AntiClockWise" << endl;
        }
        else if (p == 11)
        {
            cout << "move Back ClockWise" << endl;
        }
        else if (p == 12)
        {
            cout << "move Back AntiClockWise" << endl;
        }
        else
        {
            cout << "Unknown move: " << p << endl;
        }
    }
    cout << endl;
}

int main(int argc, char *argv[])
{
    int ***startState = getCube();
    int ***finalState = getCube();

    takeInput(startState, finalState, argc, argv);

    initialize_cubie_definitions_and_map(finalState);

    cout << "Initial state Manhattan heuristic: " << heuristic_manhattan_rewards(startState, finalState) << endl;

    int cost_limit = heuristic_manhattan_rewards(startState, finalState);
    stack<int> current_path_moves;
    stack<int> solution_path;

    const int MAX_SOLUTION_DEPTH = 25;

    while (true)
    {
        node *root_search_node = new node();
        root_search_node->setCurrState(startState);
        root_search_node->prevMove = 0;

        cout << "Searching with cost limit (f_max): " << cost_limit << endl;

        current_path_moves = stack<int>();
        int next_threshold_candidate = ida_star_search_step(root_search_node, 0, cost_limit,
                                                            finalState, current_path_moves, solution_path);

        delete root_search_node;

        if (next_threshold_candidate == 0)
        {
            cout << "Found!" << endl;
            cout << "The depth (number of moves) is: " << solution_path.size() << endl;
            printSolutionInOrder(solution_path);
            break;
        }

        if (next_threshold_candidate == numeric_limits<int>::max())
        {
            cout << "Not Found (exhausted search space or no solution within limits). Current cost_limit: " << cost_limit << endl;
            break;
        }

        cost_limit = next_threshold_candidate;

        if (cost_limit > MAX_SOLUTION_DEPTH * 2)
        {
            cout << "Search limit exceeded (cost_limit " << cost_limit << " > MAX_SOLUTION_DEPTH " << MAX_SOLUTION_DEPTH << "). Stopping." << endl;
            break;
        }
    }

    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            delete[] startState[i][j];
            delete[] finalState[i][j];
        }
        delete[] startState[i];
        delete[] finalState[i];
    }
    delete[] startState;
    delete[] finalState;

    return 0;
}