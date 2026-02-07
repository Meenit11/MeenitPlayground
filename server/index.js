import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { roomRoutes } from './rooms.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// API routes for Odd One In rooms
app.use('/api/rooms', roomRoutes)

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`🎮 Meenit's Playground server running on port ${PORT}`)
})
