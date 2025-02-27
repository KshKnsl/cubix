"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import RubiksCube from "@/components/rubiks-cube"
import NumberSlider from "@/components/number-slider"
import Sudoku from "@/components/sudoku"
import { AlgorithmInfo } from "@/components/algorithm-info"
import { Trophy, Brain, Clock, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground theme-transition">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        <header className="mb-12 text-center animate-slide-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary animate-pulse-slow" />
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Cubix
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8">Master Algorithmic Puzzle Solving</p>

          <div className="flex justify-center gap-8 mt-6">
            <div className="group flex flex-col items-center transition-transform hover:scale-105">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Trophy className="h-6 w-6 text-primary animate-bounce-slow" />
              </div>
              <span className="mt-2 text-sm font-medium text-muted-foreground">Earn Points</span>
            </div>
            <div className="group flex flex-col items-center transition-transform hover:scale-105">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Brain className="h-6 w-6 text-primary animate-bounce-slow" />
              </div>
              <span className="mt-2 text-sm font-medium text-muted-foreground">Learn Algorithms</span>
            </div>
            <div className="group flex flex-col items-center transition-transform hover:scale-105">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Clock className="h-6 w-6 text-primary animate-bounce-slow" />
              </div>
              <span className="mt-2 text-sm font-medium text-muted-foreground">Beat the Clock</span>
            </div>
          </div>
        </header>

        <Tabs defaultValue="rubiks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 p-2 gap-2">
            <TabsTrigger
              value="rubiks"
              className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-blue-500 rounded-md shadow-lg"></div>
              Rubik's Cube
            </TabsTrigger>
            <TabsTrigger
              value="slider"
              className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-md shadow-lg"></div>
              Number Slider
            </TabsTrigger>
            <TabsTrigger
              value="sudoku"
              className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <div className="w-8 h-8 grid grid-cols-3 grid-rows-3 gap-0.5 bg-primary/10 p-1 rounded-md shadow-lg">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`${i % 2 === 0 ? "bg-primary" : "bg-primary/80"} rounded-sm`} />
                ))}
              </div>
              Sudoku
            </TabsTrigger>
          </TabsList>

          <div className="grid gap-8">
            <TabsContent value="rubiks" className="animate-slide-in">
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

            <TabsContent value="slider" className="animate-slide-in">
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

            <TabsContent value="sudoku" className="animate-slide-in">
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
          </div>
        </Tabs>
      </div>
    </main>
  )
}

