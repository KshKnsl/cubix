"use client"
import Link from 'next/link'
import RubiksCube3D from "@/components/rubiks-cube-3d"
import { AlgorithmInfo } from "@/components/algorithm-info"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function RubiksSolvePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link href="/games/rubiks" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Rubik's Cube
        </Link>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <Card className="overflow-hidden h-full">
          <CardContent className="p-0 sm:p-6">
            <RubiksCube3D />
          </CardContent>
        </Card>

        <AlgorithmInfo
          title="Kociemba's Algorithm"
          description="A two-phase approach for solving the Rubik's Cube efficiently. Phase 1 reduces the cube to a subgroup where only specific moves are needed, while Phase 2 solves the reduced state."
          complexity="Time Complexity: O(n²)"
          steps={[
            "Orient the edges",
            "Orient the corners",
            "Place the edges of the middle layer",
            "Solve the remaining pieces",
          ]}
          visualization="/kociemba-algorithm.svg"
        />
      </div>
    </main>
  )
}
