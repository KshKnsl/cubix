"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Cube3D } from "@/components/cube-3d"
import { SolutionSteps } from "@/components/solution-steps"
import { Sparkles, RotateCcw, Timer, Trophy } from "lucide-react"
import { motion } from "framer-motion"

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

    // Simulate solving process
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <CardHeader className="bg-slate-700 border-b border-slate-600">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-blue-400 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-blue-500 rounded-sm"></div>
                Rubik's Cube
              </CardTitle>
              <CardDescription className="text-slate-300">Solve using Kociemba's Algorithm</CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-900/30 text-blue-300 border-blue-700 flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              {points} pts
            </Badge>
          </div>
        </CardHeader>

        <div className="px-6 pt-4 pb-2 bg-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-slate-400" />
              <span className="text-slate-300 text-sm">
                {isSolving ? `Solving: ${timeElapsed}s` : isSolved ? `Solved in: ${solveTime}s` : "Ready to solve"}
              </span>
            </div>
            <Progress value={progress} className="w-1/2 h-2 bg-slate-700" indicatorClassName="bg-emerald-500" />
          </div>
        </div>

        <CardContent className="p-6">
          <Tabs defaultValue="cube" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cube">Cube</TabsTrigger>
              <TabsTrigger value="solution" disabled={!isSolved}>
                Solution
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cube" className="mt-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="aspect-square w-full max-w-md mx-auto bg-slate-900/50 rounded-lg p-4 border border-slate-700"
              >
                <Cube3D />
              </motion.div>
            </TabsContent>

            <TabsContent value="solution" className="mt-4">
              <SolutionSteps steps={["R U R' U'", "F R' F' R", "U R U' R'", "R' D' R D"]} />
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between bg-slate-700 border-t border-slate-600 p-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSolve}
            disabled={isSolving || isSolved}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isSolving ? "Solving..." : isSolved ? "Solved!" : "Solve"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
