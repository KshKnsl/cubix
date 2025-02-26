"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { SolutionSteps } from "@/components/solution-steps"
import { Sparkles, RotateCcw, Timer, Trophy } from "lucide-react"
import { motion } from "motion/react"

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
          const newProgress = prev + 100 / 25 // Assuming 25 seconds to solve
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

    // Simulate solving process
    setTimeout(() => {
      setIsSolving(false)
      setIsSolved(true)
      setSolveTime(timeElapsed)
      setPoints((prev) => prev + Math.floor(100 - timeElapsed * 2) + 50)

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

    // Only allow numbers 1-9 or empty
    if (!/^[1-9]?$/.test(value)) return

    const newBoard = [...board.map((row) => [...row])]
    newBoard[row][col] = value
    setBoard(newBoard)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <CardHeader className="bg-slate-700 border-b border-slate-600">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-purple-400 flex items-center gap-2">
                <div className="w-6 h-6 grid grid-cols-3 grid-rows-3 gap-0.5">
                  {[...Array(9)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`${i % 2 === 0 ? "bg-emerald-500" : "bg-purple-500"} rounded-sm`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    ></motion.div>
                  ))}
                </div>
                Sudoku Challenge
              </CardTitle>
              <CardDescription className="text-slate-300">Solve using Backtracking Algorithm</CardDescription>
            </div>
            <Badge
              variant="outline"
              className="bg-purple-900/30 text-purple-300 border-purple-700 flex items-center gap-1"
            >
              <Trophy className="h-3 w-3" />
              {points} pts
            </Badge>
          </div>
        </CardHeader>

        <div className="px-6 pt-4 pb-2 bg-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-slate-400" />
              <span className="text-slate-300 text-sm">
                {isSolving ? `Solving: ${timeElapsed}s` : isSolved ? `Solved in: ${solveTime}s` : "Ready to solve"}
              </span>
            </div>
            <Progress value={progress} className="w-1/2 h-2 bg-slate-700" indicatorClassName="bg-purple-500" />
          </div>
        </div>

        <CardContent className="p-6">
          <Tabs defaultValue="puzzle" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="puzzle">Puzzle</TabsTrigger>
              <TabsTrigger value="solution" disabled={!isSolved}>
                Solution
              </TabsTrigger>
            </TabsList>

            <TabsContent value="puzzle" className="mt-4">
              <motion.div
                className="grid grid-cols-9 gap-0.5 aspect-square w-full max-w-md mx-auto bg-slate-900 rounded-lg p-4 border border-slate-700"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
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
                        ${isEvenBox ? "bg-slate-700" : "bg-slate-600"}
                        ${row === 2 || row === 5 ? "border-b-2 border-purple-500" : ""}
                        ${col === 2 || col === 5 ? "border-r-2 border-purple-500" : ""}
                        focus:ring-purple-500 focus:border-purple-500
                      `}
                      maxLength={1}
                      readOnly={isSolving}
                    />
                  )
                })}
              </motion.div>
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
                theme="purple"
              />
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between bg-slate-700 border-t border-slate-600 p-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSolve}
            disabled={isSolving || isSolved}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isSolving ? "Solving..." : isSolved ? "Solved!" : "Solve"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
