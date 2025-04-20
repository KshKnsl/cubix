"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
  const [solution, setSolution] = useState([])
  const [currentStep, setCurrentStep] = useState(0) // Track the current solution step

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

  const handleSolve = async () => {
    setIsSolving(true);
    try {
      const response = await fetch('/api/number-slider/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board: board.flat() }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || 'Failed to solve puzzle');
      }

      const { output } = await response.json();
      const solutionSteps = output.split('\n').filter(Boolean);
      setSolution(solutionSteps);
      setIsSolved(true);
    } catch (error) {
      console.error('Solve error:', error);
    } finally {
      setIsSolving(false);
    }
  };

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
    setCurrentStep(0)
  }

  const handleShuffle = () => {
    setBoard([
      [5, 1, 2, 4],
      [9, 6, 3, 8],
      [13, 10, 7, 12],
      [0, 14, 11, 15],
    ])
    setCurrentStep(0)
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

  const applyStep = (step) => {
    const [row, col] = step.split(',').map(Number);
    const emptyPos = findEmptyTile();
    if (!emptyPos) return;

    const [emptyRow, emptyCol] = emptyPos;
    const newBoard = [...board.map((row) => [...row])];
    newBoard[emptyRow][emptyCol] = board[row][col];
    newBoard[row][col] = 0;
    setBoard(newBoard);
  };

  const handleNextStep = () => {
    if (currentStep < solution.length - 1) {
      setCurrentStep((prev) => prev + 1);
      applyStep(solution[currentStep + 1]);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      applyStep(solution[currentStep - 1]);
    }
  };

  const getTileStyle = (tile) => {
    if (tile === 0) return "bg-muted/30 text-muted-foreground"

    return `
      bg-[url('https://www.shutterstock.com/image-vector/uniform-walnut-wooden-texture-horizontal-600nw-2221081683.jpg')] 
      bg-cover bg-center
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

