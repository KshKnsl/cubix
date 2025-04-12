"use client"
import Link from 'next/link'
import NumberSlider from "@/components/number-slider"
import { AlgorithmInfo } from "@/components/algorithm-info"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SliderSolvePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link href="/games/slider" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Number Slider
        </Link>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <NumberSlider />
          </CardContent>
        </Card>

        <AlgorithmInfo
          title="A* Search Algorithm"
          description="A* is an informed search algorithm that finds the shortest path from a start state to a goal state. It uses a heuristic function (Manhattan Distance) to guide the search."
          complexity="Time Complexity: O(b^d) where b is the branching factor and d is the depth"
          steps={[
            "Calculate f(n) = g(n) + h(n) for each state",
            "Explore states with lowest f(n) first",
            "Use Manhattan Distance as heuristic",
            "Reconstruct path once goal is found",
          ]}
          visualization="/astar-algorithm.svg"
        />
      </div>
    </main>
  )
}
