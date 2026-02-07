import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../../../components/Button'

const API_BASE = '/api/rooms'

export default function CreateRoom() {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleCreate() {
    setError('')
    if (!name.trim() || name.trim().length < 2) {
      setError("Your name needs at least 2 letters. We're not that casual here!")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostName: name.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create room')
      localStorage.setItem('oddOneIn_playerId', data.playerId)
      localStorage.setItem('oddOneIn_roomCode', data.code)
      navigate(`/odd-one-in/room/${data.code}`)
    } catch (err) {
      setError(err.message || "Oops! The room factory malfunctioned. Try again?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen odd-create">
      <Link to="/odd-one-in" className="back-btn">← Back</Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img src="/images/Odd One In Logo.png" alt="Odd One In" className="logo-small" />
        <p className="tagline">Be Weird or Be Gone!</p>
        <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
        />
        {error && <p className="error-msg">{error}</p>}
        <Button onClick={handleCreate} disabled={loading}>
          {loading ? "Creating chaos..." : "Create Room"}
        </Button>
        <Link to="/" className="btn-secondary" style={{ marginTop: 12, display: 'block', textAlign: 'center', textDecoration: 'none', padding: '14px' }}>
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}
