"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid3x3, Play, Wand2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import RubiksCube3D from "@/components/rubiks-cube-3d"

export default function RubiksPage() {
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
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-blue-500">
              <Grid3x3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl md:text-3xl">Rubik's Cube</CardTitle>
              <CardDescription>Master the classic 3D combination puzzle</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="prose dark:prose-invert">
              <h2>How to Play</h2>
              <p>The Rubik's Cube is a 3D combination puzzle invented in 1974. The goal is to return each face to a solid color.</p>
              <h3>Rules:</h3>
              <ul>
                <li>Each face can be rotated clockwise or counterclockwise</li>
                <li>The cube is solved when all sides show a single color</li>
                <li>A standard 3x3x3 cube has over 43 quintillion possible combinations</li>
              </ul>
              <h3>Controls:</h3>
              <ul>
                <li>Click and drag to rotate the cube view</li>
                <li>Click face buttons to rotate cube faces</li>
                <li>Use keyboard shortcuts (F, B, R, L, U, D) for faster moves</li>
              </ul>
            </div>
            <div className="w-full max-w-sm mx-auto">
              <RubiksCube3D />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <Link href="/games/rubiks/play" className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <Button className="w-full h-24 md:h-32 text-lg md:text-xl gap-4" variant="default">
            <Play className="h-6 w-6" />
            Play Game
          </Button>
        </Link>
        <Link href="/games/rubiks/solve" className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <Button className="w-full h-24 md:h-32 text-lg md:text-xl gap-4" variant="outline">
            <Wand2 className="h-6 w-6" />
            Solve Puzzle
          </Button>
        </Link>
      </div>
    </main>
  )
}
