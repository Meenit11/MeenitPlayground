import { useNavigate } from 'react-router-dom'
import { loadGameState, clearGameState } from '../utils/gameState'
import { Confetti } from '../../../components/Confetti'
import { useState } from 'react'

export default function Winner() {
  const navigate = useNavigate()
  const state = loadGameState()
  const [confettiDone, setConfettiDone] = useState(false)

  if (!state) {
    navigate('/undercover')
    return null
  }

  const winner = state.winner
  const messages = {
    agents: "🎉 Agents Win!",
    spy: "🎭 Spy Wins!",
    mr_white: "⚪ Mr. White Wins!",
  }

  function handlePlayAgain() {
    clearGameState()
    navigate('/undercover')
  }

  return (
    <div className="screen uc-winner">
      <Confetti isActive={!confettiDone} onComplete={() => setConfettiDone(true)} />
      <h1 className="uc-winner__title">{messages[winner] || 'Game Over'}</h1>
      <p className="uc-winner__words">
        Agent Word: <strong>{state.agentWord}</strong><br />
        Spy Word: <strong>{state.spyWord}</strong>
      </p>
      <button type="button" className="btn-primary" onClick={handlePlayAgain}>
        Play Again
      </button>
    </div>
  )
}
