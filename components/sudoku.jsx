"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { SolutionSteps } from "@/components/solution-steps"
import { Sparkles, RotateCcw, Timer, Trophy, Grid3x3, Lightbulb } from "lucide-react"
import SudokuExecuter from "@/cpp/sudoku_executer"

export default function Sudoku() {
  const [isSolving, setIsSolving] = useState(false)
  const [isSolved, setIsSolved] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [solveTime, setSolveTime] = useState(0)
  const [points, setPoints] = useState(100)
  const [hint, setHint] = useState(null)
  const [selectedCell, setSelectedCell] = useState(null)
  const [difficulty, setDifficulty] = useState(null)
  const [errors, setErrors] = useState(0)
  const [board, setBoard] = useState(() =>
    Array(9)
      .fill(null)
      .map(() => Array(9).fill("")),
  )
  const [solution, setSolution] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const engineRef = useRef(null)
  const { toast } = useToast()

  // Initialize the engine
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new SudokuExecuter()
      setIsInitialized(true)
    }
    return () => {
      if (engineRef.current) {
        engineRef.current.cleanup()
      }
    }
  }, [])

  // Fetch puzzle once engine is initialized
  useEffect(() => {
    if (isInitialized) {
      fetchNewPuzzle()
    }
  }, [isInitialized])

  const fetchNewPuzzle = async () => {
    try {
      const response = await fetch('https://sudoku-api.vercel.app/api/dosuku')
      const data = await response.json()
      const puzzle = data.newboard.grids[0]
      const newBoard = puzzle.value.map(row => row.map(cell => cell === 0 ? "" : cell.toString()))
      setBoard(newBoard)
      setSolution(puzzle.solution.map(row => row.map(cell => cell.toString())))
      setDifficulty(puzzle.difficulty)
      setPoints(100)
      setErrors(0)
      setHint(null)
      setSelectedCell(null)
      setIsSolved(false)
      setTimeElapsed(0)
      
      // Initialize the engine with the new puzzle
      if (engineRef.current) {
        try {
          await engineRef.current.setBoard(puzzle.value)
        } catch (error) {
          console.error('Failed to initialize engine with new puzzle:', error)
          toast.error("Failed to initialize puzzle. Please try again.")
        }
      }
    } catch (error) {
      console.error('Failed to fetch puzzle:', error)
      toast.error("Failed to fetch new puzzle. Please try again.")
    }
  }

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

  const validateBoard = async () => {
    if (!engineRef.current) return false
    const result = await engineRef.current.checkValidity()
    return result === "Valid"
  }

  const handleSolve = async () => {
    if (!engineRef.current) return

    setIsSolving(true)
    setTimeElapsed(0)
    setProgress(0)

    const solution = await engineRef.current.solve()
    const solutionArray = solution.split(" ").map(Number)
    const solutionBoard = solutionArray.map(row => row.map(cell => cell === 0 ? "" : cell.toString()))
    
    setIsSolving(false)
    setIsSolved(true)
    setSolveTime(timeElapsed)
    
    // Calculate points based on difficulty and time
    const difficultyMultiplier = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 1.5 : 2
    const timeBonus = Math.max(0, 300 - timeElapsed)
    const newPoints = Math.floor((100 + timeBonus) * difficultyMultiplier)
    setPoints((prev) => prev + newPoints)

    setBoard(solutionBoard)
  }

  const handleReset = () => {
    fetchNewPuzzle()
  }

  const handleCellChange = async (row, col, value) => {
    if (isSolving) return
    if (!/^[1-9]?$/.test(value)) return

    const newBoard = [...board.map((row) => [...row])]
    newBoard[row][col] = value
    setBoard(newBoard)

    // Update engine board
    if (engineRef.current) {
      try {
        await engineRef.current.setBoard(newBoard.flat())
        
        // Check if the board is complete and correct
        if (value !== '' && await engineRef.current.checkValidity()) {
          setIsSolved(true)
          setSolveTime(timeElapsed)
          const difficultyMultiplier = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 1.5 : 2
          const timeBonus = Math.max(0, 300 - timeElapsed)
          const newPoints = Math.floor((200 + timeBonus) * difficultyMultiplier)
          setPoints((prev) => prev + newPoints)
        }
      } catch (error) {
        console.error('Failed to update board:', error)
      }
    }
  }

  const handleGetHint = async () => {
    if (!engineRef.current || !selectedCell) return
    const [row, col] = selectedCell
    const hint = await engineRef.current.getHint(row, col)
    setHint(hint)
  }

  const handleCellClick = (row, col) => {
    if (board[row][col] === "") {
      setSelectedCell([row, col])
      setHint(null)
    }
  }

  return (
    <>
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
              <CardDescription>
                {difficulty ? `Difficulty: ${difficulty}` : 'Loading puzzle...'}
              </CardDescription>
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
                {isSolving ? `Solving: ${timeElapsed}s` : isSolved ? `Solved in: ${solveTime}s` : `Time: ${timeElapsed}s`}
              </span>
            </div>
            <Progress value={progress} className="w-1/2" />
          </div>
          {hint && (
            <div className="mt-2 text-sm text-primary">{hint}</div>
          )}
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
                  const isOriginalCell = cell !== ""
                  const isSelected = selectedCell && selectedCell[0] === row && selectedCell[1] === col

                  return (
                    <Input
                      key={index}
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(row, col, e.target.value)}
                      onClick={() => handleCellClick(row, col)}
                      className={`
                        p-0 text-center aspect-square text-lg font-medium cursor-pointer
                        ${isEvenBox ? "bg-primary/5" : "bg-primary/10"}
                        ${isOriginalCell ? "text-primary font-bold" : ""}
                        ${isSelected ? "ring-2 ring-primary" : ""}
                        ${row === 2 || row === 5 ? "border-b-2 border-primary/30" : ""}
                        ${col === 2 || col === 5 ? "border-r-2 border-primary/30" : ""}
                        focus:ring-primary/30 focus:border-primary/30
                        transition-colors
                      `}
                      maxLength={1}
                      readOnly={isSolving || isOriginalCell}
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              New Puzzle
            </Button>
            <Button variant="outline" onClick={handleGetHint} disabled={!selectedCell || isSolved}>
              <Lightbulb className="h-4 w-4 mr-2" />
              Hint
            </Button>
          </div>
          <Button onClick={handleSolve} disabled={isSolving || isSolved} className="bg-primary hover:bg-primary/90">
            <Sparkles className="h-4 w-4 mr-2" />
            {isSolving ? "Solving..." : isSolved ? "Solved!" : "Show Solution"}
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </>
  )
}
