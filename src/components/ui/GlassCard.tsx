import { cn } from "@/lib/utils"
import { Card, CardProps } from "./card"

export function GlassCard({ className, children, ...props }: CardProps) {
  return (
    <Card 
      className={cn(
        "backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-700/20 shadow-lg",
        className
      )} 
      {...props}
    >
      {children}
    </Card>
  )
}
