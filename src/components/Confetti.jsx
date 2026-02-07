import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Confetti({ isActive, onComplete }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!isActive) return
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94', '#c3c3e6']
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      delay: Math.random() * 0.3,
      duration: 1.5 + Math.random() * 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }))
    setParticles(newParticles)
    const timer = setTimeout(() => {
      onComplete?.()
    }, 3000)
    return () => clearTimeout(timer)
  }, [isActive, onComplete])

  return (
    <AnimatePresence>
      {isActive && (
        <div className="confetti-container">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="confetti-piece"
              initial={{ opacity: 1, y: 0, rotate: 0 }}
              animate={{
                opacity: 0,
                y: 400,
                rotate: p.rotation + 720,
                x: p.x * 2,
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeOut',
              }}
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: Math.random() > 0.5 ? '50%' : 2,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
