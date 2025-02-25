import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RubiksCube from "@/components/rubiks-cube"
import NumberSlider from "@/components/number-slider"
import Sudoku from "@/components/sudoku"
import { AlgorithmInfo } from "@/components/algorithm-info"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
            Cubix
          </h1>
          <p className="text-xl text-slate-600">Advanced Puzzle Solving Tool</p>
          <div className="flex justify-center gap-4 mt-4">
            <div className="text-sm text-slate-500">Arpit Varshney (23103299)</div>
            <div className="text-sm text-slate-500">Kush Kansal (23103278)</div>
            <div className="text-sm text-slate-500">Prakhar Singhal (23103303)</div>
          </div>
        </header>

        <Tabs defaultValue="rubiks" className="w-full h-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="rubiks" className="text-lg">
              Rubik's Cube
            </TabsTrigger>
            <TabsTrigger value="slider" className="text-lg py-3">
              Number Slider
            </TabsTrigger>
            <TabsTrigger value="sudoku" className="text-lg py-3">
              Sudoku
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rubiks" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RubiksCube />
              <AlgorithmInfo
                title="Kociemba's Algorithm"
                description="A two-phase approach for solving the Rubik's Cube efficiently. Phase 1 reduces the cube to a subgroup where only specific moves are needed, while Phase 2 solves the reduced state."
                complexity="Time Complexity: O(n²)"
                steps={[
                  "Orient the edges",
                  "Orient the corners",
                  "Place the edges of the middle layer",
                  "Solve the remaining pieces",
                ]}
                visualization="/kociemba-algorithm.svg"
              />
            </div>
          </TabsContent>

          <TabsContent value="slider" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <NumberSlider />
              <AlgorithmInfo
                title="A* Search Algorithm"
                description="A* is an informed search algorithm that finds the shortest path from a start state to a goal state. It uses a heuristic function (Manhattan Distance) to guide the search."
                complexity="Time Complexity: O(b^d) where b is the branching factor and d is the depth"
                steps={[
                  "Calculate f(n) = g(n) + h(n) for each state",
                  "Explore states with lowest f(n) first",
                  "Use Manhattan Distance as heuristic",
                  "Reconstruct path once goal is found",
                ]}
                visualization="/astar-algorithm.svg"
              />
            </div>
          </TabsContent>

          <TabsContent value="sudoku" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Sudoku />
              <AlgorithmInfo
                title="Backtracking with Constraint Propagation"
                description="A recursive algorithm that tries different values for empty cells, backtracking when a contradiction is found. Constraint propagation reduces the search space."
                complexity="Time Complexity: O(9^m) where m is the number of empty cells"
                steps={[
                  "Find an empty cell",
                  "Try digits 1-9 for the cell",
                  "Check if digit is valid in current position",
                  "If valid, recursively try to fill next cell",
                  "If not valid or no solution found, backtrack",
                ]}
                visualization="/backtracking-algorithm.svg"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

