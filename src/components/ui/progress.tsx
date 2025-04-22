
import * as React from "react"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number
    max?: number
    indicatorClassName?: string
    color?: "default" | "success" | "warning" | "error"
  }
>(({ className, value, max = 100, indicatorClassName, color = "default", ...props }, ref) => {
  const percentage = value != null ? (value / max) * 100 : 0

  // Color variants for the progress indicator
  const colorVariants = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500"
  }

  const selectedColor = colorVariants[color]

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/10",
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 transition-all", selectedColor, indicatorClassName)}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }
