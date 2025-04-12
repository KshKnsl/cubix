"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { SolutionSteps } from "@/components/solution-steps"
import { Sparkles, RotateCcw, Timer, Trophy, Shuffle, Grid2x2 } from "lucide-react"

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
          const newProgress = prev + 100 / 15
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

  const getTileStyle = (tile) => {
    if (tile === 0) return "bg-muted/30 text-muted-foreground"

    return `
      bg-gradient-to-br from-primary/30 to-primary/20
      hover:from-primary/40 hover:to-primary/30
      text-primary-foreground
      shadow-md
      border border-primary/30
      cursor-pointer
      transition-all
      hover:scale-105
      active:scale-95
    `
  }

  return (
    <Card className="theme-transition bg-card text-card-foreground">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <div className="p-2 rounded-md bg-gradient-to-br from-primary to-primary/60 shadow">
                <Grid2x2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span>Number Slider</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">Solve using A* Search Algorithm</CardDescription>
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
          <Progress value={progress} className="w-1/2 bg-muted/30" />
        </div>
      </div>

      <CardContent>
        <Tabs defaultValue="puzzle" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/20">
            <TabsTrigger value="puzzle" className="text-foreground hover:bg-muted/10">Puzzle</TabsTrigger>
            <TabsTrigger value="solution" disabled={!isSolved} className="text-foreground hover:bg-muted/10">
              Solution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="puzzle" className="mt-4">
            <div className="grid grid-cols-4 gap-2 aspect-square w-full max-w-md mx-auto bg-muted/30 rounded-lg p-4 border theme-transition">
              {board.flat().map((tile, index) => {
                const row = Math.floor(index / 4)
                const col = index % 4
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-center text-2xl font-semibold rounded-md ${getTileStyle(tile)} aspect-square`}
                    onClick={() => handleTileClick(row, col)}
                  >
                    {tile !== 0 && tile}
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="solution" className="mt-4 animate-slide-in">
            <SolutionSteps steps={["Move 15 right", "Move 14 up", "Move 13 right", "Move 12 up", "Move 11 right"]} />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-muted text-foreground hover:bg-muted/10"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button 
            variant="outline" 
            className="border-muted text-foreground hover:bg-muted/10"
            onClick={handleShuffle}
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
        </div>
        <Button 
          onClick={handleSolve} 
          disabled={isSolving || isSolved} 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isSolving ? "Solving..." : isSolved ? "Solved!" : "Solve"}
        </Button>
      </CardFooter>
    </Card>
  )
}

