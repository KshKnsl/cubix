"use client"
import Link from 'next/link'
import Sudoku from "@/components/sudoku"
import { Card, CardContent } from "@/components/ui/card"

export default function SudokuPlayPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/games/sudoku" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Sudoku
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <Sudoku />
        </CardContent>
      </Card>
    </main>
  )
}
