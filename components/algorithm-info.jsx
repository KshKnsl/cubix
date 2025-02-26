import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { Info, ListChecks, Eye, Award } from "lucide-react"

export function AlgorithmInfo({ title, description, complexity, steps, visualization }) {
  return (
    <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 overflow-hidden">
      <CardHeader className="bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-emerald-600 dark:text-blue-400">{title}</CardTitle>
            <CardDescription className="text-gray-600 dark:text-slate-300">{complexity}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-blue-300 border-emerald-300 dark:border-blue-700">
            Algorithm
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-slate-700">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="steps" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              Steps
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="mastery" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Mastery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-6">
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{description}</p>
          </TabsContent>

          <TabsContent value="steps" className="p-6">
            <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-slate-300">
              {steps.map((step, index) => (
                <li key={index} className="pl-2">
                  {step}
                </li>
              ))}
            </ol>
          </TabsContent>

          <TabsContent value="visual" className="p-6 flex justify-center">
            <div className="relative h-64 w-full">
              <Image
                src={visualization || "/placeholder.svg?height=250&width=400"}
                alt={`${title} visualization`}
                fill
                className="object-contain"
              />
            </div>
          </TabsContent>

          <TabsContent value="mastery" className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-slate-300">Algorithm Understanding</span>
                  <span className="text-emerald-600 dark:text-blue-400">65%</span>
                </div>
                <Progress value={65} className="h-2 bg-gray-200 dark:bg-slate-700" indicatorClassName="bg-emerald-500" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-slate-300">Solving Speed</span>
                  <span className="text-emerald-600 dark:text-blue-400">42%</span>
                </div>
                <Progress value={42} className="h-2 bg-gray-200 dark:bg-slate-700" indicatorClassName="bg-emerald-500" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-slate-300">Optimization Skills</span>
                  <span className="text-emerald-600 dark:text-blue-400">78%</span>
                </div>
                <Progress value={78} className="h-2 bg-gray-200 dark:bg-slate-700" indicatorClassName="bg-emerald-500" />
              </div>

              <div className="flex gap-2 mt-4">
                <Badge variant="outline" className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 border-gray-300 dark:border-slate-600">
                  Beginner
                </Badge>
                <Badge variant="outline" className="bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-blue-300 border-emerald-300 dark:border-blue-700">
                  Intermediate
                </Badge>
                <Badge variant="outline" className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 border-gray-300 dark:border-slate-600">
                  Advanced
                </Badge>
                <Badge variant="outline" className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 border-gray-300 dark:border-slate-600">
                  Expert
                </Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
