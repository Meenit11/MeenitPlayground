import { motion } from 'framer-motion'

export function Button({ children, onClick, variant = 'primary', disabled, className = '', type = 'button' }) {
  return (
    <motion.button
      type={type}
      className={`btn btn--${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.button>
  )
}
