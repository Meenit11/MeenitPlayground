import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { Button } from '../../../components/Button'
import { Confetti } from '../../../components/Confetti'

const API_BASE = '/api/rooms'

export default function Winner() {
  const { code } = useParams()
  const navigate = useNavigate()
  const playerId = localStorage.getItem('oddOneIn_playerId')
  const { room } = useRoom(code, playerId)
  const [confettiDone, setConfettiDone] = useState(false)

  const winners = room?.players?.filter(p => !p.eliminated) || []
  const isHost = room?.hostId === playerId

  async function handlePlayAgain() {
    // Reset eliminations, back to lobby
    const players = room.players.map(p => ({ ...p, eliminated: false }))
    await fetch(`${API_BASE}/${code}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        players,
        state: 'lobby',
        round: 0,
        question: null,
        answers: {},
      }),
    })
    navigate(`/odd-one-in/room/${code}`)
  }

  async function handleGoHome() {
    await fetch(`${API_BASE}/${code}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, isHost }),
    })
    navigate('/')
  }

  if (!room) return <div className="screen"><p>Loading...</p></div>

  return (
    <div className="screen odd-winner">
      <Confetti isActive={!confettiDone} onComplete={() => setConfettiDone(true)} />
      <h1 className="odd-winner__title">🏆 Winner{winners.length > 1 ? 's' : ''}!</h1>
      <div className="odd-winner__names">
        {winners.map(w => w.name).join(' & ')}
      </div>
      <p className="odd-winner__msg">You survived the weirdness. Well done, you beautiful oddball(s)!</p>
      <div className="odd-winner__actions">
        <Button onClick={handlePlayAgain}>Play Again</Button>
        <Button variant="secondary" onClick={handleGoHome}>Go to Home</Button>
      </div>
    </div>
  )
}
