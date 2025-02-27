import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { Info, ListChecks, Eye, Award, Code2, Zap } from "lucide-react"

export function AlgorithmInfo({ title, description, complexity, steps, visualization }) {
  return (
    <Card className="theme-transition h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <div className="p-2 rounded-md bg-gradient-to-br from-primary to-primary/60">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span>{title}</span>
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              {complexity}
            </CardDescription>
          </div>
          <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30">
            Algorithm
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
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

          <div className="p-6">
            <TabsContent value="overview" className="mt-0">
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </TabsContent>

            <TabsContent value="steps" className="mt-0">
              <ol className="space-y-3">
                {steps.map((step, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 animate-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </TabsContent>

            <TabsContent value="visual" className="mt-0">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted/30 border theme-transition">
                <Image
                  src={visualization || "/placeholder.svg?height=250&width=400"}
                  alt={`${title} visualization`}
                  fill
                  className="object-contain"
                />
              </div>
            </TabsContent>

            <TabsContent value="mastery" className="mt-0 space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Algorithm Understanding</span>
                    <span className="text-sm font-medium text-primary">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Solving Speed</span>
                    <span className="text-sm font-medium text-primary">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Optimization Skills</span>
                    <span className="text-sm font-medium text-primary">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-center py-1 font-normal bg-muted/30">
                    Beginner
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-1 font-normal bg-primary/20 text-primary border-primary/30"
                  >
                    Intermediate
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-center py-1 font-normal bg-muted/30">
                    Advanced
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center py-1 font-normal bg-muted/30">
                    Expert
                  </Badge>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

