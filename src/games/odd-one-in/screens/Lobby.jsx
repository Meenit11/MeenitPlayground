import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { Button } from '../../../components/Button'
import { getQuestionTier, fetchQuestions, getRandomQuestion } from '../utils/questions'

const API_BASE = '/api/rooms'

export default function Lobby() {
  const { code } = useParams()
  const navigate = useNavigate()
  const playerId = localStorage.getItem('oddOneIn_playerId')
  const { room, loading, error, refetch, updateRoom } = useRoom(code, playerId)
  const [copied, setCopied] = useState(false)
  const [starting, setStarting] = useState(false)

  const isHost = room?.hostId === playerId
  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/odd-one-in/join` : ''
  const shareText = `Join my Odd One In game! Code: ${code}\n${inviteUrl}`

  useEffect(() => {
    if (room?.state === 'question') {
      navigate(`/odd-one-in/game/${code}`)
    } else if (room?.state === 'review') {
      navigate(`/odd-one-in/review/${code}`)
    } else if (room?.state === 'winner') {
      navigate(`/odd-one-in/winner/${code}`)
    }
  }, [room?.state, code, navigate])

  async function handleStart() {
    if (!room || room.players.length < 3) return
    setStarting(true)
    try {
      const questionsData = await fetchQuestions()
      const tier = getQuestionTier(room.players.length)
      const question = getRandomQuestion(questionsData, tier)
      await updateRoom({
        state: 'question',
        round: 1,
        question,
        answers: {},
        timerPaused: false,
        timerEndsAt: Date.now() + 2000 + 10000, // 2s ready + 10s timer
      })
      navigate(`/odd-one-in/game/${code}`)
    } catch (err) {
      console.error(err)
    } finally {
      setStarting(false)
    }
  }

  async function handleBack() {
    if (isHost) {
      await fetch(`${API_BASE}/${code}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, isHost: true }),
      })
    }
    navigate('/odd-one-in')
  }

  function copyLink() {
    navigator.clipboard?.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function shareWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  async function kickPlayer(id) {
    await fetch(`${API_BASE}/${code}/players/${id}`, { method: 'DELETE' })
    refetch()
  }

  if (loading || !room) {
    return (
      <div className="screen">
        <p className="loading-msg">Loading lobby... Don't wander off!</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="screen">
        <p className="error-msg">{error}</p>
        <Link to="/odd-one-in">Back to Game</Link>
      </div>
    )
  }

  return (
    <div className="screen odd-lobby">
      <button type="button" className="back-btn" onClick={handleBack}>← Back</button>
      <img src="/images/Odd One In Logo.png" alt="Odd One In" className="logo-small" />
      <p className="tagline">Be Weird or Be Gone!</p>

      <div className="odd-lobby__code">
        <span className="odd-lobby__code-label">Room Code</span>
        <span className="odd-lobby__code-value">{code}</span>
      </div>

      <div className="odd-lobby__share">
        <button type="button" className="odd-lobby__share-btn" onClick={shareWhatsApp}>
          📱 Share on WhatsApp
        </button>
        <button type="button" className="odd-lobby__share-btn" onClick={copyLink}>
          {copied ? '✓ Copied!' : '📋 Copy Link'}
        </button>
      </div>

      <p className="odd-lobby__count">{room.players.length} players in lobby</p>

      <div className="odd-lobby__players">
        {room.players.map((p) => (
          <div key={p.id} className="odd-lobby__player">
            <span>{p.isHost ? '👑 ' : ''}{p.name}{p.eliminated ? ' (out)' : ''}</span>
            {isHost && !p.isHost && (
              <button type="button" className="odd-lobby__kick" onClick={() => kickPlayer(p.id)}>❌</button>
            )}
          </div>
        ))}
      </div>

      {isHost && (
        <>
          <Button
            onClick={handleStart}
            disabled={room.players.length < 3 || starting}
          >
            {starting ? 'Starting...' : `Start Game (min 3 players)`}
          </Button>
          <Button variant="secondary" onClick={handleBack} className="odd-lobby__back">
            Back to Home (ends room)
          </Button>
        </>
      )}

      {!isHost && (
        <p className="odd-lobby__waiting">Waiting for Game Master to start...</p>
      )}

      <div className="odd-lobby__rules">
        <strong>Rules:</strong> Answer uniquely! Duplicates & blanks get eliminated. Last weirdo(s) win!
      </div>
    </div>
  )
}
