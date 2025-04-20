import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Info, ListChecks, Code2, Zap } from "lucide-react"

export function AlgorithmInfo({ title, description, complexity, steps }) {
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
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="steps" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              Steps
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
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}