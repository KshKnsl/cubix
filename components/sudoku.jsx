"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Sparkles, RotateCcw, Timer, Trophy, Grid3x3, Lightbulb } from "lucide-react"
import SudokuExecuter from "@/cpp/sudoku_executer"

const EMPTY_BOARD = Array(9).fill().map(() => Array(9).fill(''))

export default function Sudoku() {
  const [isSolving, setIsSolving] = useState(false)
  const [board, setBoard] = useState(EMPTY_BOARD)
  const [selectedCell, setSelectedCell] = useState(null)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [points, setPoints] = useState(100)
  const [engine] = useState(() => new SudokuExecuter())
  const { toast } = useToast()

  useEffect(() => {
    const initEngine = async () => {
      try {
        await engine.initialize()
        fetchNewPuzzle()
      } catch (err) {
        toast({
          title: "Error",
          description: 'Failed to initialize Sudoku engine: ' + err.message,
          variant: "destructive"
        })
      }
    }
    initEngine()
  }, [engine])

  const fetchNewPuzzle = async () => {
    try {
      const response = await fetch('https://sudoku-api.vercel.app/api/dosuku')
      const data = await response.json()
      const puzzle = data.newboard.grids[0]
      const newBoard = puzzle.value.map(row => row.map(cell => cell === 0 ? "" : cell.toString()))
      setBoard(newBoard)
      await engine.setBoard(newBoard)
      setMessage('New puzzle loaded!')
      setError(null)
      setPoints(100)
      setTimeElapsed(0)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch new puzzle: " + err.message,
        variant: "destructive"
      })
    }
  }

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col })
    setError(null)
  }

  const handleKeyPress = async (event) => {
    if (!selectedCell) return
    
    const { row, col } = selectedCell
    const key = event.key

    if (key === 'Backspace' || key === 'Delete') {
      const newBoard = board.map(row => [...row])
      newBoard[row][col] = ''
      setBoard(newBoard)
      await engine.setBoard(newBoard)
      return
    }

    if (key >= '1' && key <= '9') {
      const newBoard = board.map(row => [...row])
      newBoard[row][col] = key
      setBoard(newBoard)
      await engine.setBoard(newBoard)
      
      try {
        const isValid = await engine.check()
        if (!isValid) {
          setPoints(prev => Math.max(0, prev - 10))
          toast({
            title: "Invalid Move",
            description: "That number violates Sudoku rules!",
            variant: "destructive"
          })
        }
      } catch (err) {
        console.error('Error checking move:', err)
      }
    }
  }

  const handleSolve = async () => {
    try {
      setIsSolving(true)
      setError(null)
      const solution = await engine.solve()
      const newBoard = Array(9).fill().map((_, i) => 
        solution.slice(i * 9, (i + 1) * 9)
      )
      setBoard(newBoard)
      toast({
        title: "Success",
        description: "Puzzle solved!",
        variant: "default"
      })
    } catch (err) {
      toast({
        title: "Error",
        description: 'Failed to solve: ' + err.message,
        variant: "destructive"
      })
    } finally {
      setIsSolving(false)
    }
  }

  const handleCheck = async () => {
    try {
      const isValid = await engine.check()
      toast({
        title: isValid ? "Valid Board" : "Invalid Board",
        description: isValid ? "Current board configuration is valid!" : "Current board configuration is invalid!",
        variant: isValid ? "default" : "destructive"
      })
    } catch (err) {
      toast({
        title: "Error",
        description: 'Failed to check board: ' + err.message,
        variant: "destructive"
      })
    }
  }

  const handleHint = async () => {
    if (!selectedCell) {
      toast({
        title: "Select a Cell",
        description: "Please select an empty cell first",
        variant: "default"
      })
      return
    }

    try {
      const hint = await engine.hint(selectedCell.row, selectedCell.col)
      if (hint && !isNaN(hint)) {
        const newBoard = board.map(row => [...row])
        newBoard[selectedCell.row][selectedCell.col] = hint
        setBoard(newBoard)
        setPoints(prev => Math.max(0, prev - 5))
        toast({
          title: "Hint Used",
          description: `Placed ${hint} in the selected cell`,
          variant: "default"
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: 'Failed to get hint: ' + err.message,
        variant: "destructive"
      })
    }
  }

  const handleClear = async () => {
    const newBoard = Array(9).fill().map(() => Array(9).fill(''))
    setBoard(newBoard)
    await engine.setBoard(newBoard)
    toast({
      title: "Board Cleared",
      description: "Starting fresh!",
      variant: "default"
    })
  }

  const handleNumberClick = async (number) => {
    if (!selectedCell) return
    const { row, col } = selectedCell
    const newBoard = board.map(row => [...row])
    newBoard[row][col] = number
    setBoard(newBoard)
    await engine.setBoard(newBoard)
  }

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-9 gap-0 p-1 rounded-lg border-2 border-gray-400">
          {board.map((row, i) => (
            row.map((cell, j) => {
              const boxRow = Math.floor(i / 3)
              const boxCol = Math.floor(j / 3)
              const isEvenBox = (boxRow + boxCol) % 2 === 0

              return (
                <div
                  key={`${i}-${j}`}
                  className={`
                    flex items-center justify-center
                    w-12 h-12 text-lg font-semibold p-0
                    ${selectedCell?.row === i && selectedCell?.col === j ? 'ring-2 ring-primary' : ''}
                    ${isEvenBox ? 'bg-white' : 'bg-gray-50'}
                  `}
                  onClick={() => handleCellClick(i, j)}
                >
                  {cell}
                </div>
              )
            })
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchNewPuzzle}>
              <RotateCcw className="h-4 w-4 mr-2" />
              New Puzzle
            </Button>
            <Button variant="outline" onClick={handleCheck}>
              <Trophy className="h-4 w-4 mr-2" />
              Check
            </Button>
            <Button variant="outline" onClick={handleHint}>
              <Lightbulb className="h-4 w-4 mr-2" />
              Hint
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
          <span className="text-lg font-semibold">
            Time: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
          </span>
          <Button 
            onClick={handleSolve} 
            disabled={isSolving}
            className={isSolving ? 'opacity-50' : ''}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isSolving ? 'Solving...' : 'Solve'}
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-x-2 gap-y-1 mt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              onClick={() => handleNumberClick(num)}
              variant="outline"
            >
              {num}
            </Button>
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  )
}
