"use client"
import Link from 'next/link'
import Sudoku from "@/components/sudoku"
import { AlgorithmInfo } from "@/components/algorithm-info"
import { Card, CardContent } from "@/components/ui/card"

export default function SudokuSolvePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/games/sudoku" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Sudoku
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <Sudoku />
          </CardContent>
        </Card>

        <AlgorithmInfo
          title="Backtracking with Constraint Propagation"
          description="A recursive algorithm that tries different values for empty cells, backtracking when a contradiction is found. Constraint propagation reduces the search space."
          complexity="Time Complexity: O(9^m) where m is the number of empty cells"
          steps={[
            "Find an empty cell",
            "Try digits 1-9 for the cell",
            "Check if digit is valid in current position",
            "If valid, recursively try to fill next cell",
            "If not valid or no solution found, backtrack",
          ]}
          visualization="/backtracking-algorithm.svg"
        />
      </div>
    </main>
  )
}
