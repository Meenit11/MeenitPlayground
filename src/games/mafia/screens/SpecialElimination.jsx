import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadGameState, saveGameState } from '../utils/gameState'
import { ROLES } from '../constants/roles'

export default function SpecialElimination() {
  const navigate = useNavigate()
  const state = loadGameState()
  const [selected, setSelected] = useState(null)

  if (!state) {
    navigate('/mafia')
    return null
  }

  const { eliminatedPlayer } = state
  const isBomber = eliminatedPlayer?.role === ROLES.BOMBER
  const isJester = eliminatedPlayer?.role === ROLES.JESTER

  const alivePlayers = state.players.filter(p => p.alive && p.name !== eliminatedPlayer?.name)

  function handleJesterPickVictim(victim) {
    const updated = state.players.map(p =>
      p.name === victim.name || p.name === eliminatedPlayer?.name ? { ...p, alive: false } : p
    )
    saveGameState({ ...state, players: updated, winner: 'jester' })
    navigate('/mafia/winner')
  }

  function handleBomberPick() {
    if (!selected) return
    const updated = state.players.map(p =>
      p.name === selected.name || p.name === eliminatedPlayer?.name ? { ...p, alive: false } : p
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

  if (isJester) {
    return (
      <div className="screen mafia-special">
        <h2>🤡 JESTER WINS!</h2>
        <p>Pass phone to Jester - pick one victim to join you!</p>
        <div className="mafia-special__grid">
          {alivePlayers.map((p) => (
            <button
              key={p.name}
              type="button"
              className={`mafia-special__card ${selected?.name === p.name ? 'selected' : ''}`}
              onClick={() => setSelected(p)}
            >
              {p.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => selected && handleJesterPickVictim(selected)}
          disabled={!selected}
        >
          Confirm (Both Die)
        </button>
      </div>
    )
  }

  if (isBomber) {
    return (
      <div className="screen mafia-special">
        <h2>💣 BOMBER ACTIVATED!</h2>
        <p>Pass phone to Bomber - who's coming with you?</p>
        <div className="mafia-special__grid">
          {alivePlayers.map((p) => (
            <button
              key={p.name}
              type="button"
              className={`mafia-special__card ${selected?.name === p.name ? 'selected' : ''}`}
              onClick={() => setSelected(p)}
            >
              {p.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={handleBomberPick}
          disabled={!selected}
        >
          Confirm
        </button>
      </div>
    )
  }

  return null
}

function checkWinCondition(state) {
  const alive = state.players.filter(p => p.alive)
  const mafiaCount = alive.filter(p => p.role === ROLES.MAFIA).length
  const civilianCount = alive.filter(p => p.role !== ROLES.MAFIA).length

  if (mafiaCount === 0) return 'civilians'
  if (mafiaCount >= civilianCount) return 'mafia'
  return null
}
