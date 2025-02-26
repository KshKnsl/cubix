import { Check, ChevronRight } from "lucide-react"
import { motion } from "motion/react"

export function SolutionSteps({ steps, theme = "blue" }) {
  const getThemeColors = () => {
    switch (theme) {
      case "amber":
        return {
          checkBg: "bg-amber-600",
          stepBg: "bg-amber-950/50",
          border: "border-amber-800",
          icon: "text-amber-400",
        }
      case "purple":
        return {
          checkBg: "bg-purple-600",
          stepBg: "bg-purple-950/50",
          border: "border-purple-800",
          icon: "text-purple-400",
        }
      default:
        return {
          checkBg: "bg-emerald-600",
          stepBg: "bg-slate-700",
          border: "border-slate-600",
          icon: "text-blue-400",
        }
    }
  }

  const colors = getThemeColors()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-200">Solution Steps</h3>
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <motion.li 
            key={index} 
            className="flex items-start" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: index * 0.2 }}
          >
            <div className={`mr-2 mt-0.5 ${colors.checkBg} rounded-full p-1`}>
              <Check className="h-3 w-3 text-white" />
            </div>
            <div className={`flex-1 ${colors.stepBg} rounded-md p-3 border ${colors.border}`}>
              <div className="flex items-center">
                <ChevronRight className={`h-4 w-4 mr-2 ${colors.icon}`} />
                <span className="text-slate-200">{step}</span>
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}
