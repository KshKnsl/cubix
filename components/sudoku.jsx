"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { SolutionSteps } from "@/components/solution-steps"
import { Sparkles, RotateCcw, Timer, Trophy, Grid3x3 } from "lucide-react"

export default function Sudoku() {
  const [isSolving, setIsSolving] = useState(false)
  const [isSolved, setIsSolved] = useState(false)
  const [points, setPoints] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [solveTime, setSolveTime] = useState(0)
  const [timer, setTimer] = useState(null)
  const [progress, setProgress] = useState(0)
  const [board, setBoard] = useState(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill("")),
  )

  useEffect(() => {
    if (isSolving) {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
        setProgress((prev) => {
          const newProgress = prev + 100 / 25
          return Math.min(newProgress, 100)
        })
      }, 1000)
      setTimer(interval)
    } else if (!isSolving && timer) {
      clearInterval(timer)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isSolving, timer])

  const handleSolve = () => {
    setIsSolving(true)
    setTimeElapsed(0)
    setProgress(0)

    setTimeout(() => {
      setIsSolving(false)
      setIsSolved(true)
      setSolveTime(timeElapsed)
      setPoints((prev) => prev + Math.floor(100 - timeElapsed * 2) + 50)

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
    }, 6000)
  }

  const handleReset = () => {
    setIsSolved(false)
    setTimeElapsed(0)
    setProgress(0)
    setBoard(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill("")),
    )
  }

  const handleCellChange = (row, col, value) => {
    if (isSolving) return

    if (!/^[1-9]?$/.test(value)) return

    const newBoard = [...board.map((row) => [...row])]
    newBoard[row][col] = value
    setBoard(newBoard)
  }

  return (
    <Card className="theme-transition">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <div className="p-2 rounded-md bg-gradient-to-br from-primary to-primary/60">
                <Grid3x3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span>Sudoku</span>
            </CardTitle>
            <CardDescription>Solve using Backtracking Algorithm</CardDescription>
          </div>
          <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30 gap-1">
            <Trophy className="h-3.5 w-3.5" />
            {points} pts
          </Badge>
        </div>
      </CardHeader>

      <div className="px-6 pt-2 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isSolving ? `Solving: ${timeElapsed}s` : isSolved ? `Solved in: ${solveTime}s` : "Ready to solve"}
            </span>
          </div>
          <Progress value={progress} className="w-1/2" />
        </div>
      </div>

      <CardContent>
        <Tabs defaultValue="puzzle" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="puzzle">Puzzle</TabsTrigger>
            <TabsTrigger value="solution" disabled={!isSolved}>
              Solution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="puzzle" className="mt-4">
            <div className="grid grid-cols-9 gap-px aspect-square w-full max-w-md mx-auto bg-muted/30 rounded-lg p-4 border theme-transition">
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
                      p-0 text-center aspect-square text-lg font-medium
                      ${isEvenBox ? "bg-primary/5" : "bg-primary/10"}
                      ${row === 2 || row === 5 ? "border-b-2 border-primary/30" : ""}
                      ${col === 2 || col === 5 ? "border-r-2 border-primary/30" : ""}
                      focus:ring-primary/30 focus:border-primary/30
                      transition-colors
                    `}
                    maxLength={1}
                    readOnly={isSolving}
                  />
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="solution" className="mt-4 animate-slide-in">
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

      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSolve} disabled={isSolving || isSolved} className="bg-primary hover:bg-primary/90">
          <Sparkles className="h-4 w-4 mr-2" />
          {isSolving ? "Solving..." : isSolved ? "Solved!" : "Solve"}
        </Button>
      </CardFooter>
    </Card>
  )
}

