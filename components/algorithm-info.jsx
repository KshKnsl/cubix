import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export function AlgorithmInfo({ title, description, complexity, steps, visualization }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 rounded-t-lg">
        <CardTitle className="text-2xl text-blue-600">{title}</CardTitle>
        <CardDescription className="text-slate-600">{complexity}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="steps">Steps</TabsTrigger>
            <TabsTrigger value="visual">Visualization</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <p className="text-slate-700">{description}</p>
          </TabsContent>

          <TabsContent value="steps" className="mt-4">
            <ol className="list-decimal pl-5 space-y-2 text-slate-700">
              {steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </TabsContent>

          <TabsContent value="visual" className="mt-4 flex justify-center">
            <div className="relative h-64 w-full">
              <Image
                src={visualization || "/placeholder.svg?height=250&width=400"}
                alt={`${title} visualization`}
                fill
                className="object-contain"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

