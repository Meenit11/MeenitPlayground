import { useNavigate } from 'react-router-dom'
import { loadGameState, clearGameState } from '../utils/gameState'
import { Confetti } from '../../../components/Confetti'
import { ROLE_INFO } from '../constants/roles'
import { useState } from 'react'

export default function Winner() {
  const navigate = useNavigate()
  const state = loadGameState()
  const [confettiDone, setConfettiDone] = useState(false)

  if (!state) {
    navigate('/mafia')
    return null
  }

  const winner = state.winner
  const messages = {
    civilians: '🏛️ Civilians Win! All Mafia eliminated!',
    mafia: '🔫 Mafia Wins! They have the numbers!',
    jester: "🤡 Jester Wins! They got eliminated!",
  }

  function handlePlayAgain() {
    clearGameState()
    navigate('/mafia')
  }

  return (
    <div className="screen mafia-winner">
      <Confetti isActive={!confettiDone} onComplete={() => setConfettiDone(true)} />
      <h1 className="mafia-winner__title">{messages[winner] || 'Game Over'}</h1>
      <div className="mafia-winner__roles">
        {state.players.map((p) => (
          <div key={p.name} className="mafia-winner__role-card">
            <img src={ROLE_INFO[p.role]?.image} alt={p.role} />
            <span>{p.name} - {ROLE_INFO[p.role]?.name}</span>
          </div>
        ))}
      </div>
      <button type="button" className="btn-primary" onClick={handlePlayAgain}>
        Play Again
      </button>
    </div>
  )
}
