"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cube3D } from "@/components/cube-3d"
import { SolutionSteps } from "@/components/solution-steps"

export default function RubiksCube() {
  const [mode, setMode] = useState("play")
  const [isSolving, setIsSolving] = useState(false)
  const [isSolved, setIsSolved] = useState(false)

  const handleSolve = () => {
    setIsSolving(true)
    // Simulate solving process
    setTimeout(() => {
      setIsSolving(false)
      setIsSolved(true)
    }, 2000)
  }

  const handleReset = () => {
    setIsSolved(false)
  }

  return (
    <Card className="shadow-md border-slate-200">
      <CardHeader className="bg-slate-50 rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-blue-600">Rubik's Cube</CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="cube-mode"
              checked={mode === "solve"}
              onCheckedChange={(checked) => setMode(checked ? "solve" : "play")}
            />
            <Label htmlFor="cube-mode">{mode === "play" ? "Play Mode" : "Solver Mode"}</Label>
          </div>
        </div>
        <CardDescription className="text-slate-600">
          {mode === "play"
            ? "Interact with the cube to practice your solving skills"
            : "Set up the cube state and let the algorithm solve it"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="cube" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cube">Cube</TabsTrigger>
            <TabsTrigger value="solution" disabled={!isSolved}>
              Solution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cube" className="mt-4">
            <div className="aspect-square w-full max-w-md mx-auto bg-slate-100 rounded-lg p-4">
              <Cube3D />
            </div>
          </TabsContent>

          <TabsContent value="solution" className="mt-4">
            <SolutionSteps steps={["R U R' U'", "F R' F' R", "U R U' R'", "R' D' R D"]} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between bg-slate-50 rounded-b-lg">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        {mode === "solve" && (
          <Button onClick={handleSolve} disabled={isSolving || isSolved} className="bg-blue-600 hover:bg-blue-700">
            {isSolving ? "Solving..." : isSolved ? "Solved!" : "Solve"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

