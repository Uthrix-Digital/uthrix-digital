import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base layout
        "w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2.5",
        // Typography — matches Input
        "text-sm text-foreground placeholder:text-muted-foreground",
        // Sizing — min-height with natural resize
        "min-h-[100px] resize-y",
        // Transitions & focus
        "transition-all duration-150 outline-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
        // Validation states via aria-invalid
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
