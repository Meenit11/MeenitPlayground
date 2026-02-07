import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadGameState, saveGameState } from '../utils/gameState'

export default function EliminationSelection() {
  const navigate = useNavigate()
  const state = loadGameState()
  const [selected, setSelected] = useState(null)

  if (!state) {
    navigate('/undercover')
    return null
  }

  const alivePlayers = state.players.filter(p => p.alive)

  function handleSelect(player) {
    setSelected(player)
  }

  function handleEliminate() {
    if (!selected) return
    const updated = state.players.map(p =>
      p.name === selected.name ? { ...p, alive: false } : p
    )
    const nextState = {
      ...state,
      players: updated,
      eliminatedPlayer: selected,
      phase: 'reveal',
    }
    saveGameState(nextState)
    navigate('/undercover/reveal')
  }

  return (
    <div className="screen uc-eliminate">
      <h2>Select ONE player to eliminate</h2>
      <div className="uc-eliminate__grid">
        {alivePlayers.map((p) => (
          <button
            key={p.name}
            type="button"
            className={`uc-eliminate__card ${selected?.name === p.name ? 'uc-eliminate__card--selected' : ''}`}
            onClick={() => handleSelect(p)}
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
        Eliminate Selected Player
      </button>
    </div>
  )
}
