import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadGameState, saveGameState } from '../utils/gameState'
import { ROLES } from '../constants/roles'

export default function DayPhase() {
  const navigate = useNavigate()
  const state = loadGameState()
  const [selected, setSelected] = useState(null)

  if (!state) {
    navigate('/mafia')
    return null
  }

  const alivePlayers = state.players.filter(p => p.alive)

  function handleEliminate() {
    if (!selected) return
    const eliminated = state.players.find(p => p.name === selected.name)

    if (eliminated.role === ROLES.JESTER) {
      saveGameState({ ...state, winner: 'jester', eliminatedPlayer: eliminated })
      navigate('/mafia/winner')
      return
    }

    if (eliminated.role === ROLES.BOMBER) {
      saveGameState({ ...state, phase: 'bomber', eliminatedPlayer: eliminated })
      navigate('/mafia/special')
      return
    }

    // Regular elimination
    const updated = state.players.map(p =>
      p.name === selected.name ? { ...p, alive: false } : p
    )
    const result = checkWinCondition({ ...state, players: updated })
    if (result) {
      saveGameState({ ...state, players: updated, winner: result })
      navigate('/mafia/winner')
    } else {
      saveGameState({ ...state, players: updated, round: state.round + 1, phase: 'night' })
      navigate('/mafia/night')
    }
  }

  function handleSkip() {
    saveGameState({ ...state, round: state.round + 1, phase: 'night' })
    navigate('/mafia/night')
  }

  return (
    <div className="screen mafia-day">
      <h2>☀️ Day Phase - Round {state.round}</h2>
      <p className="mafia-day__instructions">Discuss and vote!</p>
      <div className="mafia-day__grid">
        {alivePlayers.map((p) => (
          <button
            key={p.name}
            type="button"
            className={`mafia-day__card ${selected?.name === p.name ? 'selected' : ''}`}
            onClick={() => setSelected(p)}
          >
            {p.name}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn-primary"
        onClick={handleEliminate}
        disabled={!selected}
      >
        Confirm Elimination
      </button>
      <button type="button" className="mafia-day__skip" onClick={handleSkip}>
        Skip Elimination
      </button>
    </div>
  )
}

function checkWinCondition(state) {
  const alive = state.players.filter(p => p.alive)
  const mafiaCount = alive.filter(p => p.role === ROLES.MAFIA).length
  const civilianCount = alive.filter(p => p.role !== ROLES.MAFIA).length

  if (mafiaCount === 0) return 'civilians'
  if (mafiaCount >= civilianCount) return 'mafia'
  return null
}
