'use client'
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RubiksCube from "@/components/rubiks-cube";
import NumberSlider from "@/components/number-slider";
import Sudoku from "@/components/sudoku";
import { AlgorithmInfo } from "@/components/algorithm-info";
import { Trophy, Brain, Clock, Sun, Moon } from "lucide-react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Apply dark mode class to document
    document.documentElement.classList.toggle('dark', isDarkMode);
  };

  useEffect(() => {
    // Apply initial theme based on system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  return (
    <main className={`min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500 mb-2">
            Cubix Solver
          </h1>
          <p className="text-xl text-emerald-700 dark:text-emerald-400">Master Algorithmic Puzzle Solving</p>

          <div className="flex justify-center gap-6 mt-6">
            <div className="flex flex-col items-center">
              <Trophy className="h-6 w-6 text-amber-500 dark:text-amber-400 mb-1" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Earn Points</span>
            </div>
            <div className="flex flex-col items-center">
              <Brain className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mb-1" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Learn Algorithms</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400 mb-1" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Beat the Clock</span>
            </div>
          </div>
        </header>

        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-green-600 dark:text-emerald-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>

        <Tabs defaultValue="rubiks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-emerald-50 dark:bg-emerald-900/20">
            <TabsTrigger value="rubiks" className="text-lg py-4 flex flex-col items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400">
              <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-blue-500 rounded-sm"></div>
              Rubik's Cube
            </TabsTrigger>
            <TabsTrigger value="slider" className="text-lg py-4 flex flex-col items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-600 to-amber-800 rounded-sm"></div>
              Number Slider
            </TabsTrigger>
            <TabsTrigger value="sudoku" className="text-lg py-4 flex flex-col items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400">
              <div className="w-6 h-6 grid grid-cols-3 grid-rows-3 gap-0.5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`${i % 2 === 0 ? "bg-emerald-500" : "bg-green-600"} rounded-sm`}></div>
                ))}
              </div>
              Sudoku
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rubiks" className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-emerald-100 dark:border-emerald-900/30">
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

          <TabsContent value="slider" className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-emerald-100 dark:border-emerald-900/30">
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

          <TabsContent value="sudoku" className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-emerald-100 dark:border-emerald-900/30">
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
  );
}
