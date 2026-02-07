import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { Button } from '../../../components/Button'
import { getQuestionTier, fetchQuestions, getRandomQuestion } from '../utils/questions'

const API_BASE = '/api/rooms'

export default function QuestionRound() {
  const { code } = useParams()
  const navigate = useNavigate()
  const playerId = localStorage.getItem('oddOneIn_playerId')
  const { room, updateRoom, submitAnswer, refetch } = useRoom(code, playerId)
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [phase, setPhase] = useState('ready') // ready, timer, done
  const [countdown, setCountdown] = useState(3)
  const timerRef = useRef(null)

  const isHost = room?.hostId === playerId
  const isEliminated = room?.players?.find(p => p.id === playerId)?.eliminated
  const canAnswer = !isEliminated && !isHost

  useEffect(() => {
    if (!room) return
    if (room.state === 'review') {
      navigate(`/odd-one-in/review/${code}`)
      return
    }
    if (room.state === 'winner') {
      navigate(`/odd-one-in/winner/${code}`)
      return
    }

    // Phase logic
    const now = Date.now()
    if (room.timerEndsAt) {
      if (now < room.timerEndsAt - 10000) {
        setPhase('ready')
        setCountdown(3)
      } else if (room.timerPaused) {
        setPhase('timer')
      } else if (now >= room.timerEndsAt) {
        setPhase('done')
        if (canAnswer && !submitted) {
          submitAnswer(answer)
          setSubmitted(true)
        }
      } else {
        setPhase('timer')
      }
    }
  }, [room, code, navigate, canAnswer, submitted, answer, submitAnswer])

  // Ready countdown 3,2,1
  useEffect(() => {
    if (phase !== 'ready' || !room?.timerEndsAt) return
    const endReady = room.timerEndsAt - 10000
    const interval = setInterval(() => {
      const remaining = Math.ceil((endReady - Date.now()) / 1000)
      if (remaining <= 0) {
        setPhase('timer')
        clearInterval(interval)
      } else {
        setCountdown(remaining)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [phase, room?.timerEndsAt])

  // Timer countdown - when it hits 0, host transitions to review, players auto-submit
  useEffect(() => {
    if (phase !== 'timer' || !room?.timerEndsAt) return
    if (room.timerPaused) return
    const interval = setInterval(async () => {
      const remaining = Math.ceil((room.timerEndsAt - Date.now()) / 1000)
      if (remaining <= 0) {
        if (canAnswer && !submitted) {
          await submitAnswer(answer)
          setSubmitted(true)
        }
        if (isHost) {
          await updateRoom({ state: 'review' })
        }
        clearInterval(interval)
      }
    }, 250)
    return () => clearInterval(interval)
  }, [phase, room?.timerPaused, room?.timerEndsAt, canAnswer, submitted, answer, submitAnswer, updateRoom, isHost])

  async function handleSubmit() {
    if (!canAnswer || submitted) return
    await submitAnswer(answer)
    setSubmitted(true)
  }

  async function handlePauseResume() {
    if (!isHost) return
    const paused = !room.timerPaused
    const newEndsAt = paused ? room.timerEndsAt : Date.now() + (room.timerEndsAt - Date.now())
    await updateRoom({ timerPaused: paused, timerEndsAt: newEndsAt })
  }

  async function handleReset() {
    if (!isHost) return
    await updateRoom({ timerEndsAt: Date.now() + 10000, timerPaused: false })
  }

  async function handleSkip() {
    if (!isHost) return
    await updateRoom({ state: 'review', timerPaused: true })
  }

  async function handleEditQuestion(newQuestion) {
    if (!isHost) return
    await updateRoom({ question: newQuestion })
  }

  const timerSeconds = room?.timerEndsAt ? Math.max(0, Math.ceil((room.timerEndsAt - Date.now()) / 1000)) : 0
  const isUrgent = phase === 'timer' && timerSeconds <= 3

  if (!room) return <div className="screen"><p>Loading...</p></div>

  return (
    <div className="screen odd-question">
      <h2 className="odd-question__round">Round {room.round}</h2>
      <div className="odd-question__q">{room.question}</div>

      {phase === 'ready' && (
        <div className="odd-question__ready">
          <span className="odd-question__countdown">Get Ready!</span>
          <span className="odd-question__countdown-num">{countdown}</span>
        </div>
      )}

      {phase === 'timer' && (
        <div className={`odd-question__timer ${isUrgent ? 'odd-question__timer--urgent' : ''}`}>
          {timerSeconds}s
        </div>
      )}

      {isEliminated && (
        <div className="odd-question__eliminated">Eliminated</div>
      )}

      {canAnswer && (
        <>
          <input
            type="text"
            placeholder="Enter Your Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={submitted}
          />
          <Button
            onClick={handleSubmit}
            disabled={submitted}
          >
            {submitted ? 'Answer Submitted ✓' : 'Submit Answer'}
          </Button>
        </>
      )}

      {isHost && (
        <div className="odd-question__host-controls">
          <button type="button" onClick={handlePauseResume}>
            {room.timerPaused ? 'Resume' : 'Pause'}
          </button>
          <button type="button" onClick={handleReset}>Reset</button>
          <button type="button" onClick={handleSkip}>Skip</button>
        </div>
      )}

      {phase === 'done' && (
        <p className="odd-question__waiting">Waiting for host to review...</p>
      )}
    </div>
  )
}
