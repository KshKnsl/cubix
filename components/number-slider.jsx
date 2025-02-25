"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SolutionSteps } from "@/components/solution-steps"

export default function NumberSlider() {
  const [mode, setMode] = useState("play")
  const [isSolving, setIsSolving] = useState(false)
  const [isSolved, setIsSolved] = useState(false)
  const [board, setBoard] = useState([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 0, 15]
  ])
  
  const handleSolve = () => {
    setIsSolving(true)
    // Simulate solving process
    setTimeout(() => {
      setIsSolving(false)
      setIsSolved(true)
    }, 2000)
  }
  
  const handleReset = () => {
    setIsSolved(false)
    setBoard([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 0, 15]
    ])
  }
  
  const handleTileClick = (row, col) => {
    if (mode === "solve" || isSolving) return
    
    const emptyPos = findEmptyTile()
    if (!emptyPos) return
    
    const [emptyRow, emptyCol] = emptyPos
    
    // Check if the clicked tile is adjacent to the empty tile
    if (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    ) {
      const newBoard = [...board.map(row => [...row])]
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
  
  return (
    <Card className="shadow-md border-slate-200">
      <CardHeader className="bg-slate-50 rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-blue-600">Number Slider Puzzle</CardTitle>
          <div className="flex items-center space-x-2">
            <Switch 
              id="slider-mode" 
              checked={mode === "solve"}
              onCheckedChange={(checked) => setMode(checked ? "solve" : "play")}
            />
            <Label htmlFor="slider-mode">{mode === "play" ? "Play Mode" : "Solver Mode"}</Label>
          </div>
        </div>
        <CardDescription className="text-slate-600">
          {mode === "play" 
            ? "Click on tiles adjacent to the empty space to move them" 
            : "Set up the puzzle and let the A* algorithm solve it"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="puzzle" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="puzzle">Puzzle</TabsTrigger>
            <TabsTrigger value="solution" disabled={!isSolved}>Solution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="puzzle" className="mt-4">
            <div className="grid grid-cols-4 gap-1 aspect-square w-full max-w-md mx-auto">
              {board.flat().map((tile, index) => {
                const row = Math.floor(index / 4)
                const col = index % 4
                return (
                  <div
                    key={index}
                    className={`
                      flex items-center justify-center 
                      text-2xl font-bold rounded-md
                      ${tile === 0 
                        ? 'bg-slate-100' 
                        : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'}
                      aspect-square
                    `}
                    onClick={() => handleTileClick(row, col)}
                  >
                    {tile !== 0 && tile}
                  </div>
                )
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="solution" className="mt-4">
            <SolutionSteps 
              steps={[
                "Move 15 right",
                "Move 14 up",
                "Move 13 right",
                "Move 12 up",
                "Move 11 right"
              ]}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between bg-slate-50 rounded-b-lg">
        <Button variant="outline" onClick={handleReset}>Reset</Button>
        {mode === "solve" && (
          <Button 
            onClick={handleSolve} 
            disabled={isSolving || isSolved}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSolving ? "Solving..." : isSolved ? "Solved!" : "Solve"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

