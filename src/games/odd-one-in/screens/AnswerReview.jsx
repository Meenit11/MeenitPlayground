import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { Button } from '../../../components/Button'
import { getQuestionTier, fetchQuestions, getRandomQuestion } from '../utils/questions'

export default function AnswerReview() {
  const { code } = useParams()
  const navigate = useNavigate()
  const playerId = localStorage.getItem('oddOneIn_playerId')
  const { room, updateRoom, refetch } = useRoom(code, playerId)
  const [selected, setSelected] = useState(new Set())

  const isHost = room?.hostId === playerId

  // Sort answers: blank first, then alphabetical by answer
  const sortedAnswers = room?.players
    ?.filter(p => !p.eliminated)
    .map(p => ({
      player: p,
      answer: (room.answers || {})[p.id] ?? '',
      answerTrimmed: ((room.answers || {})[p.id] ?? '').trim(),
    }))
    .sort((a, b) => {
      const aBlank = !a.answerTrimmed
      const bBlank = !b.answerTrimmed
      if (aBlank && !bBlank) return -1
      if (!aBlank && bBlank) return 1
      return (a.answerTrimmed).localeCompare(b.answerTrimmed)
    }) || []

  // Find duplicates for highlighting
  const answerCounts = {}
  sortedAnswers.forEach(({ answerTrimmed }) => {
    if (answerTrimmed) answerCounts[answerTrimmed] = (answerCounts[answerTrimmed] || 0) + 1
  })

  function toggleSelect(playerId) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(playerId)) next.delete(playerId)
      else next.add(playerId)
      return next
    })
  }

  async function handleEliminate() {
    if (!isHost) return
    const players = room.players.map(p =>
      selected.has(p.id) ? { ...p, eliminated: true } : p
    )
    const aliveCount = players.filter(p => !p.eliminated).length
    if (aliveCount <= 2) {
      await updateRoom({ players, state: 'winner' })
      navigate(`/odd-one-in/winner/${code}`)
    } else {
      const questionsData = await fetchQuestions()
      const tier = getQuestionTier(players.length)
      const question = getRandomQuestion(questionsData, tier)
      await updateRoom({
        players,
        state: 'question',
        round: room.round + 1,
        question,
        answers: {},
        timerPaused: false,
        timerEndsAt: Date.now() + 2000 + 10000,
      })
      navigate(`/odd-one-in/game/${code}`)
    }
  }

  async function handleNoElimination() {
    if (!isHost) return
    const questionsData = await fetchQuestions()
    const tier = getQuestionTier(room.players.filter(p => !p.eliminated).length)
    const question = getRandomQuestion(questionsData, tier)
    await updateRoom({
      state: 'question',
      round: room.round + 1,
      question,
      answers: {},
      timerPaused: false,
      timerEndsAt: Date.now() + 2000 + 10000,
    })
    navigate(`/odd-one-in/game/${code}`)
  }

  if (!room) return <div className="screen"><p>Loading...</p></div>

  return (
    <div className="screen odd-review">
      <h2 className="odd-review__title">Round {room.round} Results</h2>
      <div className="odd-review__list">
        {sortedAnswers.map(({ player, answer, answerTrimmed }) => {
          const isDuplicate = answerTrimmed && answerCounts[answerTrimmed] > 1
          const displayAnswer = answerTrimmed || '(No Answer)'
          return (
            <div
              key={player.id}
              className={`odd-review__item ${isDuplicate ? 'odd-review__item--duplicate' : ''} ${selected.has(player.id) ? 'odd-review__item--selected' : ''}`}
              onClick={() => isHost && toggleSelect(player.id)}
            >
              <span className="odd-review__name">{player.name}</span>
              <span className="odd-review__answer">| {displayAnswer}</span>
            </div>
          )
        })}
      </div>

      {isHost && (
        <div className="odd-review__actions">
          <Button onClick={handleEliminate}>
            Eliminate Selected ({selected.size})
          </Button>
          <Button variant="secondary" onClick={handleNoElimination}>
            Next Round (No Elimination)
          </Button>
        </div>
      )}

      {!isHost && (
        <p className="odd-review__waiting">Waiting for Game Master to decide...</p>
      )}
    </div>
  )
}
