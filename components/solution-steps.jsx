import { Check, ChevronRight } from "lucide-react"

export function SolutionSteps({ steps }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-800">Solution Steps</h3>
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start">
            <div className="mr-2 mt-0.5 bg-blue-500 rounded-full p-1">
              <Check className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1 bg-slate-100 rounded-md p-3 text-slate-700">
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-blue-500" />
                <span>{step}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

