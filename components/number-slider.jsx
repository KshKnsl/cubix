"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, RotateCcw, Shuffle, Grid2x2, Info, ChevronRight, ChevronLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import * as Dialog from "@radix-ui/react-dialog"

export default function NumberSlider() {
  const [isSolving, setIsSolving] = useState(false)
  const [isSolved, setIsSolved] = useState(false)
  const [progress, setProgress] = useState(0)
  const [moveCount, setMoveCount] = useState(0)
  const [board, setBoard] = useState([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0],
  ])
  const [solution, setSolution] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [customGrid, setCustomGrid] = useState(Array(4).fill("").map(() => Array(4).fill("")))

  const solvedState = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0],
  ]

  const currentStepRef = useRef(currentStep)
  const boardRef = useRef(board)

  useEffect(() => {
    currentStepRef.current = currentStep
    boardRef.current = board
    
    // Check if puzzle is solved
    if (JSON.stringify(board) === JSON.stringify(solvedState)) {
      setIsSolved(true)
    }
  }, [currentStep, board, moveCount])

  useEffect(() => {
    // Update progress based on solution steps
    if (solution.length > 0) {
      setProgress(Math.min(100, Math.round((currentStep / solution.length) * 100)))
    }
  }, [currentStep, solution])

  const handleSolve = async () => {
    setIsSolving(true);
    setProgress(10);
    try {
      const response = await fetch("/api/number-slider/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board: board.flat() }),
      });

      setProgress(50);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to solve puzzle");
      }

      const { output } = await response.json();
      console.log("Solve output:", output);
      setProgress(80);

      // Parse steps from output - clean up invalid entries and convert to 1-based index
      const solutionSteps = output
        .split(/\s+/) // Split by whitespace
        .filter((step) => step.match(/^\(\d+,\d+\)$/)) // Keep only valid step format "(row,col)"
        .map((step) => {
          const match = step.match(/\((\d+),(\d+)\)/);
          if (match) {
            const row = parseInt(match[1], 10) + 1; // Convert to 1-based index
            const col = parseInt(match[2], 10) + 1; // Convert to 1-based index
            return { row: parseInt(match[1], 10), col: parseInt(match[2], 10), display: `(${row},${col})` };
          }
          return step;
        });

      console.log("Parsed solution steps:", solutionSteps);

      setSolution(solutionSteps);
      setCurrentStep(0); // Reset to the first step
      setIsSolved(false); // Reset solved state
      setProgress(100);
    } catch (error) {
      console.error("Solve error:", error);
      setProgress(0);
    } finally {
      setIsSolving(false);
    }
  }

  const handleReset = () => {
    setIsSolved(false)
    setProgress(0)
    setMoveCount(0)
    setBoard([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 0],
    ])
    setSolution([])
    setCurrentStep(0)
  }

  const handleShuffle = () => {
    // Create a random yet solvable board
    const newBoard = generateSolvableBoard();
    setBoard(newBoard);
    boardRef.current = newBoard; // Update boardRef to reflect the shuffled board
    setMoveCount(0);
    setIsSolved(false);
    setSolution([]);
    setCurrentStep(0);
    setProgress(0);
  }
  
  const generateSolvableBoard = () => {
    // Generate a solvable board by making 100 random valid moves
    let newBoard = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 0],
    ]
    
    for (let i = 0; i < 100; i++) {
      const [emptyRow, emptyCol] = findEmptyTileInBoard(newBoard)
      const possibleMoves = []
      
      if (emptyRow > 0) possibleMoves.push([emptyRow - 1, emptyCol])
      if (emptyRow < 3) possibleMoves.push([emptyRow + 1, emptyCol])
      if (emptyCol > 0) possibleMoves.push([emptyRow, emptyCol - 1])
      if (emptyCol < 3) possibleMoves.push([emptyRow, emptyCol + 1])
      
      const [moveRow, moveCol] = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
      
      newBoard = moveTileInBoard(newBoard, moveRow, moveCol)
    }
    
    return newBoard
  }

  const findEmptyTileInBoard = (boardState) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (boardState[i][j] === 0) {
          return [i, j]
        }
      }
    }
    return null
  }

  const findEmptyTile = () => {
    return findEmptyTileInBoard(board)
  }

  const moveTileInBoard = (boardState, row, col) => {
    const [emptyRow, emptyCol] = findEmptyTileInBoard(boardState);
    if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) || 
        (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
      const newBoard = boardState.map((r) => [...r]);
      newBoard[emptyRow][emptyCol] = boardState[row][col];
      newBoard[row][col] = 0;
      return newBoard;
    }
    return boardState;
  };

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
      setMoveCount(prev => prev + 1)
    }
  }

  const applyNextSolutionStep = () => {
    if (solution.length === 0 || currentStep >= solution.length) return false;

    const step = solution[currentStep];
    if (!step || typeof step.row === "undefined" || typeof step.col === "undefined") {
      console.error("Invalid step during forward simulation:", step);
      return false;
    }

    // Apply only the current step to the current board state
    const { row, col } = step;
    const newBoard = moveTileInBoard(boardRef.current, row, col);

    // Update the board and boardRef
    setBoard(newBoard);
    boardRef.current = newBoard;

    // Increment currentStep
    setCurrentStep((prev) => prev + 1);
    return true;
  };

  const handleStepForward = () => {
    const success = applyNextSolutionStep();
    if (!success && currentStep === solution.length - 1) {
      setIsSolved(true); // Mark as solved if the last step is executed
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      // Get the previous step
      const prevStep = solution[currentStep - 1];
      if (!prevStep || typeof prevStep.row === "undefined" || typeof prevStep.col === "undefined") {
        console.error("Invalid step during backward simulation:", prevStep);
        return;
      }

      // Revert the last step
      const { row, col } = prevStep;
      const newBoard = moveTileInBoard(boardRef.current, row, col);

      // Update the board and boardRef
      setBoard(newBoard);
      boardRef.current = newBoard;

      // Decrement currentStep
      setCurrentStep((prev) => prev - 1);
    }
  };

  const getTileStyle = (tile) => {
    if (tile === 0) return "bg-transparent text-transparent";

    return `
      bg-[url('https://www.shutterstock.com/image-vector/uniform-walnut-wooden-texture-horizontal-600nw-2221081683.jpg')] 
      bg-cover bg-center
      text-white
      shadow-md
      border border-primary/30
      cursor-pointer
      transition-all
      hover:scale-105
      active:scale-95
    `;
  }

  const handleCustomGridChange = (row, col, value) => {
    const newGrid = [...customGrid];
    newGrid[row][col] = value;
    setCustomGrid(newGrid);
  };

  const handleApplyCustomGrid = () => {
    const parsedGrid = customGrid.map(row => row.map(val => parseInt(val, 10) || 0));
    setBoard(parsedGrid);
    boardRef.current = parsedGrid; // Update boardRef
    setMoveCount(0);
    setIsSolved(false);
    setSolution([]);
    setCurrentStep(0);
    setProgress(0);
    setIsPopupOpen(false); // Close the popup
  };

  return (
    <>
      <Card className="theme-transition bg-card text-card-foreground w-full max-w-full mx-auto p-6 rounded-lg shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <CardTitle className="text-3xl flex items-center gap-3">
                <div className="p-3 rounded-md bg-[url('https://www.shutterstock.com/image-vector/uniform-walnut-wooden-texture-horizontal-600nw-2221081683.jpg')] bg-no-repeat bg-cover shadow">
                  <Grid2x2 className="h-6 w-6 text-white" />
                </div>
                <span>Number Slider</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground text-lg">
                Solve the puzzle using the A* Search Algorithm
              </CardDescription>
            </div>
            <Badge variant={isSolved ? "success" : "outline"} className="text-lg px-4 py-2">
              {isSolved ? "Solved!" : `Moves: ${moveCount}`}
            </Badge>
          </div>
        </CardHeader>

        <div className="px-8 pt-4 pb-6">
          <div className="flex items-center justify-between gap-6">
            <span className="text-base text-muted-foreground">
              {isSolving ? "Solving..." : solution.length > 0 ? `Step ${currentStep}/${solution.length}` : "Ready to solve"}
            </span>
            <Progress value={progress} className="w-2/3 bg-muted/30 h-3 rounded-full bg-[url('https://www.shutterstock.com/image-vector/uniform-walnut-wooden-texture-horizontal-600nw-2221081683.jpg')] bg-no-repeat bg-cover" />
          </div>
        </div>

        <CardContent>
          <div className="flex flex-col lg:flex-row lg:gap-8">
            {/* Puzzle Section */}
            <div className="flex-1">
              <div className="text-lg font-medium mb-4 text-center lg:text-left">Puzzle</div>
              <div className="grid grid-cols-4 gap-4 aspect-square w-full max-w-lg mx-auto lg:mx-0 bg-muted/30 rounded-lg p-6 border theme-transition">
                {board.flat().map((tile, index) => {
                  const row = Math.floor(index / 4);
                  const col = index % 4;
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-center text-3xl font-bold rounded-md ${getTileStyle(tile)} aspect-square`}
                      onClick={() => handleTileClick(row, col)}
                    >
                      {tile !== 0 && tile}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Solution Section */}
            <div className="flex-1">
              <div className="text-lg font-medium mb-4 text-center lg:text-left">Solution</div>
              <div className="bg-muted/30 bg-[url('https://www.shutterstock.com/image-vector/uniform-walnut-wooden-texture-horizontal-600nw-2221081683.jpg')] bg-no-repeat bg-cover rounded-lg p-6 border theme-transition min-h-[400px] flex flex-col">
                <div className="text-center text-lg font-medium mb-4 text-white">
                  Solution - {solution.length} steps
                </div>

                {solution.length > 0 && (
                  <div className="flex justify-center space-x-4 mb-6">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleStepBack}
                      disabled={currentStep === 0}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleStepForward}
                      disabled={currentStep >= solution.length}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-base">
                    {solution.map((step, index) => (
                      <div
                        key={index}
                        className={`py-2 px-4 rounded ${currentStep === index ? 'bg-primary/20 font-medium text-white' : 'text-white/50'}`}
                      >
                        Step {index + 1}: Move {step.display}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between gap-4">
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-muted text-foreground hover:bg-muted/10 px-6 py-3 text-lg"
              onClick={handleReset}
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              className="border-muted text-foreground hover:bg-muted/10 px-6 py-3 text-lg"
              onClick={handleShuffle}
            >
              <Shuffle className="h-5 w-5 mr-2" />
              Shuffle
            </Button>
            <Button
              variant="outline"
              className="border-muted text-foreground hover:bg-muted/10 px-6 py-3 text-lg"
              onClick={() => setIsPopupOpen(true)}
            >
              <Info className="h-5 w-5 mr-2" />
              Create Grid
            </Button>
          </div>
          <Button
            onClick={handleSolve}
            disabled={isSolving}
            variant={isSolved ? "outline" : "default"}
            className={`px-6 py-3 text-lg ${isSolved ? "" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {isSolving ? "Solving..." : "Solve"}
          </Button>
        </CardFooter>
      </Card>

      {/* Popup for creating a custom grid */}
      <Dialog.Root open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg">
            <Dialog.Title>Create Custom Grid</Dialog.Title>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {customGrid.map((row, rowIndex) =>
                row.map((value, colIndex) => (
                  <Input
                    key={`${rowIndex}-${colIndex}`}
                    type="number"
                    value={value}
                    onChange={(e) => handleCustomGridChange(rowIndex, colIndex, e.target.value)}
                    className="text-center"
                  />
                ))
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsPopupOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyCustomGrid}>Apply</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
