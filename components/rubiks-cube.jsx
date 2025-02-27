"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Cube3D } from "@/components/cube-3d"
import { SolutionSteps } from "@/components/solution-steps"
import { Sparkles, RotateCcw, Timer, Trophy, Dices } from "lucide-react"

export default function RubiksCube() {
  const [isSolving, setIsSolving] = useState(false)
  const [isSolved, setIsSolved] = useState(false)
  const [points, setPoints] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [solveTime, setSolveTime] = useState(0)
  const [timer, setTimer] = useState(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isSolving) {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
        setProgress((prev) => {
          const newProgress = prev + 100 / 20 // Assuming 20 seconds to solve
          return Math.min(newProgress, 100)
        })
      }, 1000)
      setTimer(interval)
    } else if (!isSolving && timer) {
      clearInterval(timer)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isSolving, timer])

  const handleSolve = () => {
    setIsSolving(true)
    setTimeElapsed(0)
    setProgress(0)

    setTimeout(() => {
      setIsSolving(false)
      setIsSolved(true)
      setSolveTime(timeElapsed)
      setPoints((prev) => prev + Math.floor(100 - timeElapsed * 2) + 50)
    }, 5000)
  }

  const handleReset = () => {
    setIsSolved(false)
    setTimeElapsed(0)
    setProgress(0)
  }

  return (
    <Card className="theme-transition">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <div className="p-2 rounded-md bg-gradient-to-br from-red-500 to-blue-500">
                <Dices className="h-5 w-5 text-white" />
              </div>
              <span>Rubik's Cube</span>
            </CardTitle>
            <CardDescription>Solve using Kociemba's Algorithm</CardDescription>
          </div>
          <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30 gap-1">
            <Trophy className="h-3.5 w-3.5" />
            {points} pts
          </Badge>
        </div>
      </CardHeader>

      <div className="px-6 pt-2 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isSolving ? `Solving: ${timeElapsed}s` : isSolved ? `Solved in: ${solveTime}s` : "Ready to solve"}
            </span>
          </div>
          <Progress value={progress} className="w-1/2" />
        </div>
      </div>

      <CardContent>
        <Tabs defaultValue="cube" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cube">Cube</TabsTrigger>
            <TabsTrigger value="solution" disabled={!isSolved}>
              Solution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cube" className="mt-4">
            <div className="aspect-square w-full max-w-md mx-auto bg-muted/30 rounded-lg p-4 border theme-transition">
              <Cube3D />
            </div>
          </TabsContent>

          <TabsContent value="solution" className="mt-4 animate-slide-in">
            <SolutionSteps steps={["R U R' U'", "F R' F' R", "U R U' R'", "R' D' R D"]} />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSolve} disabled={isSolving || isSolved} className="bg-primary hover:bg-primary/90">
          <Sparkles className="h-4 w-4 mr-2" />
          {isSolving ? "Solving..." : isSolved ? "Solved!" : "Solve"}
        </Button>
      </CardFooter>
    </Card>
  )
}

