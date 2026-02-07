import { Router } from 'express'

const router = Router()
const rooms = new Map()

function generateRoomCode() {
  let code
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString()
  } while (rooms.has(code))
  return code
}

// Create room
router.post('/', (req, res) => {
  const { hostName } = req.body
  if (!hostName || hostName.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' })
  }
  const code = generateRoomCode()
  const room = {
    code,
    hostId: null,
    players: [{ id: crypto.randomUUID(), name: hostName.trim(), isHost: true, eliminated: false }],
    state: 'lobby',
    round: 0,
    question: null,
    answers: {},
    timerPaused: false,
    timerEndsAt: null,
    createdAt: Date.now(),
  }
  room.players[0].id = crypto.randomUUID()
  room.hostId = room.players[0].id
  rooms.set(code, room)
  res.json({ code, playerId: room.players[0].id, room })
})

// Join room
router.post('/:code/join', (req, res) => {
  const { code } = req.params
  const { playerName } = req.body
  if (!playerName || playerName.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' })
  }
  const room = rooms.get(code)
  if (!room) return res.status(404).json({ error: 'Room not found. Wrong code?' })
  if (room.state !== 'lobby') return res.status(400).json({ error: 'Game already started!' })
  const nameLower = playerName.trim().toLowerCase()
  if (room.players.some(p => p.name.toLowerCase() === nameLower)) {
    return res.status(400).json({ error: 'Someone already stole that name!' })
  }
  const player = { id: crypto.randomUUID(), name: playerName.trim(), isHost: false, eliminated: false }
  room.players.push(player)
  res.json({ playerId: player.id, room })
})

// Get room state (polling)
router.get('/:code', (req, res) => {
  const { code } = req.params
  const room = rooms.get(code)
  if (!room) return res.status(404).json({ error: 'Room not found' })
  res.json(room)
})

// Update room (host actions, answers, etc.)
router.put('/:code', (req, res) => {
  const { code } = req.params
  const room = rooms.get(code)
  if (!room) return res.status(404).json({ error: 'Room not found' })
  const updates = req.body
  Object.assign(room, updates)
  res.json(room)
})

// Submit answer
router.post('/:code/answer', (req, res) => {
  const { code } = req.params
  const { playerId, answer } = req.body
  const room = rooms.get(code)
  if (!room) return res.status(404).json({ error: 'Room not found' })
  if (!room.answers) room.answers = {}
  room.answers[playerId] = answer
  res.json(room)
})

// Kick player
router.delete('/:code/players/:playerId', (req, res) => {
  const { code, playerId } = req.params
  const room = rooms.get(code)
  if (!room) return res.status(404).json({ error: 'Room not found' })
  room.players = room.players.filter(p => p.id !== playerId)
  if (room.players.length === 0) rooms.delete(code)
  res.json(room)
})

// Leave room (back to home - destroys if host)
router.post('/:code/leave', (req, res) => {
  const { code } = req.params
  const { playerId, isHost } = req.body
  if (isHost) {
    rooms.delete(code)
    return res.json({ destroyed: true })
  }
  const room = rooms.get(code)
  if (!room) return res.json({ destroyed: true })
  room.players = room.players.filter(p => p.id !== playerId)
  if (room.players.length === 0) rooms.delete(code)
  res.json(room)
})

export const roomRoutes = router
export { rooms }
