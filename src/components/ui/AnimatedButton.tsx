import { Button, ButtonProps } from "./button"
import { motion } from "framer-motion"

export function AnimatedButton({ children, ...props }: ButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button {...props}>
        {children}
      </Button>
    </motion.div>
  )
}
