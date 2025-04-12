"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid2x2, Play, Wand2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SliderPage() {
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
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800">
              <Grid2x2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-3xl">Number Slider</CardTitle>
              <CardDescription>Arrange the numbers in ascending order</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <h2>How to Play</h2>
          <p>The Number Slider puzzle consists of a grid of numbered tiles with one empty space. The goal is to arrange the numbers in ascending order.</p>
          <h3>Rules:</h3>
          <ul>
            <li>Click any tile adjacent to the empty space to move it</li>
            <li>Numbers must be arranged in ascending order from left to right, top to bottom</li>
            <li>The empty space should end up in the bottom-right corner</li>
          </ul>
          <h3>Controls:</h3>
          <ul>
            <li>Click tiles to move them into the empty space</li>
            <li>Use arrow keys to move tiles (optional)</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/games/slider/play">
          <Button className="w-full h-32 text-xl gap-4" variant="default">
            <Play className="h-6 w-6" />
            Play Game
          </Button>
        </Link>
        <Link href="/games/slider/solve">
          <Button className="w-full h-32 text-xl gap-4" variant="outline">
            <Wand2 className="h-6 w-6" />
            Solve Puzzle
          </Button>
        </Link>
      </div>
    </main>
  )
}
