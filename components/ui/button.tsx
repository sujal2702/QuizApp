import * as React from "react"
import { cn } from "@/lib/utils"

const variantStyles = {
  default: "bg-violet-600 text-white hover:bg-violet-700",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-100",
  secondary: "bg-zinc-800 text-white hover:bg-zinc-700",
  ghost: "hover:bg-zinc-800 text-zinc-100",
  link: "text-violet-400 underline-offset-4 hover:underline",
}

const sizeStyles = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

// Export buttonVariants as a function for compatibility
export const buttonVariants = ({ variant = "default", size = "default", className }: { variant?: keyof typeof variantStyles; size?: keyof typeof sizeStyles; className?: string } = {}) => {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors",
    variantStyles[variant],
    sizeStyles[size],
    className
  )
}

export { Button }
