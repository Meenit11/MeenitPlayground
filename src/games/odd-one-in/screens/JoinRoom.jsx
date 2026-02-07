import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../../../components/Button'

const API_BASE = '/api/rooms'

export default function JoinRoom() {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleJoin() {
    setError('')
    if (!code.trim() || code.length !== 4) {
      setError("Room code is 4 digits. No more, no less. Like a PIN!")
      return
    }
    if (!name.trim() || name.trim().length < 2) {
      setError("Your name needs at least 2 letters!")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/${code.trim()}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: name.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to join')
      localStorage.setItem('oddOneIn_playerId', data.playerId)
      localStorage.setItem('oddOneIn_roomCode', code.trim())
      navigate(`/odd-one-in/room/${code.trim()}`)
    } catch (err) {
      setError(err.message || "Couldn't find that room. Wrong code?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen odd-join">
      <Link to="/odd-one-in" className="back-btn">← Back</Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img src="/images/Odd One In Logo.png" alt="Odd One In" className="logo-small" />
        <p className="tagline">Be Weird or Be Gone!</p>
        <input
          type="text"
          placeholder="Room Code (4 digits)"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
          inputMode="numeric"
        />
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
        />
        {error && <p className="error-msg">{error}</p>}
        <Button onClick={handleJoin} disabled={loading}>
          {loading ? "Sneaking in..." : "Join Room"}
        </Button>
        <Link to="/" className="btn-secondary" style={{ marginTop: 12, display: 'block', textAlign: 'center', textDecoration: 'none', padding: '14px' }}>
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}
