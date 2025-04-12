"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid3x3, Play, Wand2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SudokuPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Games
        </Link>
        <ThemeToggle />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Grid3x3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl">Sudoku</CardTitle>
              <CardDescription>Fill the grid with numbers following Sudoku rules</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <h2>How to Play</h2>
          <p>Sudoku is a logic-based number placement puzzle. The goal is to fill a 9×9 grid with digits so that each column, each row, and each of the nine 3×3 subgrids contain all of the digits from 1 to 9.</p>
          <h3>Rules:</h3>
          <ul>
            <li>Fill each empty cell with a number from 1 to 9</li>
            <li>Each row must contain all numbers from 1 to 9</li>
            <li>Each column must contain all numbers from 1 to 9</li>
            <li>Each 3x3 box must contain all numbers from 1 to 9</li>
          </ul>
          <h3>Controls:</h3>
          <ul>
            <li>Click a cell to select it</li>
            <li>Type a number (1-9) to fill the selected cell</li>
            <li>Press Delete or Backspace to clear a cell</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Link href="/games/sudoku/play">
          <Button className="w-full h-32 text-xl gap-4" variant="default">
            <Wand2 className="h-6 w-6" />
            Play and Solve Game
          </Button>
        </Link>
      </div>
    </main>
  )
}
