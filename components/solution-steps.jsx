import { Check, ChevronRight } from "lucide-react"

export function SolutionSteps({ steps }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Solution Steps</h3>
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start animate-slide-in" style={{ animationDelay: `${index * 200}ms` }}>
            <div className="mr-2 mt-0.5 bg-primary/20 text-primary rounded-full p-1">
              <Check className="h-3 w-3" />
            </div>
            <div className="flex-1 bg-muted/30 rounded-md p-3 border theme-transition">
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                <span>{step}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

