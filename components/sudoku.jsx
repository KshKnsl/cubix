"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { SolutionSteps } from "@/components/solution-steps"

export default function Sudoku() {
  const [mode, setMode] = useState("play")
  const [isSolving, setIsSolving] = useState(false)
  const [isSolved, setIsSolved] = useState(false)
  const [board, setBoard] = useState(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill("")),
  )

  const handleSolve = () => {
    setIsSolving(true)
    // Simulate solving process
    setTimeout(() => {
      setIsSolving(false)
      setIsSolved(true)

      // Example solved board
      const solvedBoard = [
        ["5", "3", "4", "6", "7", "8", "9", "1", "2"],
        ["6", "7", "2", "1", "9", "5", "3", "4", "8"],
        ["1", "9", "8", "3", "4", "2", "5", "6", "7"],
        ["8", "5", "9", "7", "6", "1", "4", "2", "3"],
        ["4", "2", "6", "8", "5", "3", "7", "9", "1"],
        ["7", "1", "3", "9", "2", "4", "8", "5", "6"],
        ["9", "6", "1", "5", "3", "7", "2", "8", "4"],
        ["2", "8", "7", "4", "1", "9", "6", "3", "5"],
        ["3", "4", "5", "2", "8", "6", "1", "7", "9"],
      ]
      setBoard(solvedBoard)
    }, 2000)
  }

  const handleReset = () => {
    setIsSolved(false)
    setBoard(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill("")),
    )
  }

  const handleCellChange = (row, col, value) => {
    if (mode === "solve" && isSolved) return

    // Only allow numbers 1-9 or empty
    if (!/^[1-9]?$/.test(value)) return

    const newBoard = [...board.map((row) => [...row])]
    newBoard[row][col] = value
    setBoard(newBoard)
  }

  return (
    <Card className="shadow-md border-slate-200">
      <CardHeader className="bg-slate-50 rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-blue-600">Sudoku</CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="sudoku-mode"
              checked={mode === "solve"}
              onCheckedChange={(checked) => setMode(checked ? "solve" : "play")}
            />
            <Label htmlFor="sudoku-mode">{mode === "play" ? "Play Mode" : "Solver Mode"}</Label>
          </div>
        </div>
        <CardDescription className="text-slate-600">
          {mode === "play"
            ? "Fill in the grid following Sudoku rules"
            : "Input the puzzle and let the backtracking algorithm solve it"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="puzzle" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="puzzle">Puzzle</TabsTrigger>
            <TabsTrigger value="solution" disabled={!isSolved}>
              Solution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="puzzle" className="mt-4">
            <div className="grid grid-cols-9 gap-0.5 aspect-square w-full max-w-md mx-auto">
              {board.flat().map((cell, index) => {
                const row = Math.floor(index / 9)
                const col = index % 9
                const boxRow = Math.floor(row / 3)
                const boxCol = Math.floor(col / 3)
                const isEvenBox = (boxRow + boxCol) % 2 === 0

                return (
                  <Input
                    key={index}
                    type="text"
                    value={cell}
                    onChange={(e) => handleCellChange(row, col, e.target.value)}
                    className={`
                      p-0 text-center aspect-square
                      ${isEvenBox ? "bg-slate-100" : "bg-white"}
                      ${row === 2 || row === 5 ? "border-b-2 border-slate-400" : ""}
                      ${col === 2 || col === 5 ? "border-r-2 border-slate-400" : ""}
                    `}
                    maxLength={1}
                    readOnly={mode === "solve" && isSolved}
                  />
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="solution" className="mt-4">
            <SolutionSteps
              steps={[
                "Apply constraint propagation to reduce possibilities",
                "Start backtracking from top-left cell",
                "Try values 1-9 for each empty cell",
                "Check row, column, and 3x3 box constraints",
                "Backtrack when contradictions are found",
              ]}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between bg-slate-50 rounded-b-lg">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        {mode === "solve" && (
          <Button onClick={handleSolve} disabled={isSolving || isSolved} className="bg-blue-600 hover:bg-blue-700">
            {isSolving ? "Solving..." : isSolved ? "Solved!" : "Solve"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

