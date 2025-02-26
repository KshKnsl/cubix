"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { SolutionSteps } from "@/components/solution-steps"
import { Sparkles, RotateCcw, Timer, Trophy, Shuffle } from "lucide-react"

export default function NumberSlider() {
  const [isSolving, setIsSolving] = useState(false)
  const [isSolved, setIsSolved] = useState(false)
  const [points, setPoints] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [solveTime, setSolveTime] = useState(0)
  const [timer, setTimer] = useState(null)
  const [progress, setProgress] = useState(0)
  const [board, setBoard] = useState([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 0, 15],
  ])

  useEffect(() => {
    if (isSolving) {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
        setProgress((prev) => {
          const newProgress = prev + 100 / 15 // Assuming 15 seconds to solve
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
    }, 4000)
  }

  const handleReset = () => {
    setIsSolved(false)
    setTimeElapsed(0)
    setProgress(0)
    setBoard([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 0, 15],
    ])
  }

  const handleShuffle = () => {
    // Simple shuffle for demonstration
    setBoard([
      [5, 1, 2, 4],
      [9, 6, 3, 8],
      [13, 10, 7, 12],
      [0, 14, 11, 15],
    ])
  }

  const handleTileClick = (row, col) => {
    if (isSolving) return

    const emptyPos = findEmptyTile()
    if (!emptyPos) return

    const [emptyRow, emptyCol] = emptyPos

    // Check if the clicked tile is adjacent to the empty tile
    if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) || (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
      const newBoard = [...board.map((row) => [...row])]
      newBoard[emptyRow][emptyCol] = board[row][col]
      newBoard[row][col] = 0
      setBoard(newBoard)
    }
  }

  const findEmptyTile = () => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          return [i, j]
        }
      }
    }
    return null
  }

  // Wooden tile styles
  const getTileStyle = (tile) => {
    if (tile === 0) return "bg-amber-900/20 border-2 border-dashed border-amber-800/30"

    return `
      bg-gradient-to-br from-amber-600 to-amber-800 
      text-amber-100 
      shadow-md 
      border-2 border-amber-700
      hover:from-amber-700 hover:to-amber-900
      cursor-pointer
      relative
      overflow-hidden
      before:content-[''] before:absolute before:inset-0 before:bg-[url('/wood-grain.png')] before:opacity-30 before:bg-cover
    `
  }

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <CardHeader className="bg-slate-700 border-b border-slate-600">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-amber-400 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-600 to-amber-800 rounded-sm"></div>
              Wooden Slider Puzzle
            </CardTitle>
            <CardDescription className="text-slate-300">Solve using A* Search Algorithm</CardDescription>
          </div>
          <Badge variant="outline" className="bg-amber-900/30 text-amber-300 border-amber-700 flex items-center gap-1">
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
          <Progress value={progress} className="w-1/2 h-2 bg-slate-700" indicatorClassName="bg-amber-500" />
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
              className="grid grid-cols-4 gap-1 aspect-square w-full max-w-md mx-auto bg-amber-950 rounded-lg p-4 border-4 border-amber-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {board.flat().map((tile, index) => {
                const row = Math.floor(index / 4)
                const col = index % 4
                return (
                  <motion.div
                    key={index}
                    className={`
                      flex items-center justify-center 
                      text-2xl font-bold rounded-md
                      ${getTileStyle(tile)}
                      aspect-square
                    `}
                    onClick={() => handleTileClick(row, col)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {tile !== 0 && tile}
                  </motion.div>
                )
              })}
            </motion.div>
          </TabsContent>

          <TabsContent value="solution" className="mt-4">
            <SolutionSteps
              steps={["Move 15 right", "Move 14 up", "Move 13 right", "Move 12 up", "Move 11 right"]}
              theme="amber"
            />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between bg-slate-700 border-t border-slate-600 p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            variant="outline"
            onClick={handleShuffle}
            className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
        </div>
        <Button
          onClick={handleSolve}
          disabled={isSolving || isSolved}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isSolving ? "Solving..." : isSolved ? "Solved!" : "Solve"}
        </Button>
      </CardFooter>
    </Card>
  )
}
