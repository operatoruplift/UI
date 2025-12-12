import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, ...props }, ref) => {
    return (
      <div className={cn("relative w-full flex items-center", leftIcon ? "pl-0" : "")}>
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-foreground/60">
            {leftIcon}
          </span>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md bg-foreground/5 text-foreground px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-background file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            leftIcon && "pl-9",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
