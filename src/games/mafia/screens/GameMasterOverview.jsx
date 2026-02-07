import { useNavigate } from 'react-router-dom'
import { loadGameState, saveGameState } from '../utils/gameState'
import { ROLE_INFO } from '../constants/roles'

export default function GameMasterOverview() {
  const navigate = useNavigate()
  const state = loadGameState()
  if (!state) {
    navigate('/mafia')
    return null
  }

  function handleStartNight() {
    saveGameState({ ...state, phase: 'night' })
    navigate('/mafia/night')
  }

  return (
    <div className="screen mafia-gm">
      <h2>Game Master Overview</h2>
      <p className="mafia-gm__warning">⚠️ DO NOT show players!</p>
      <div className="mafia-gm__grid">
        {state.players.map((p) => (
          <div key={p.name} className="mafia-gm__card">
            <span className="mafia-gm__name">{p.name}</span>
            <span className="mafia-gm__role">{ROLE_INFO[p.role]?.name}</span>
          </div>
        ))}
      </div>
      <button type="button" className="btn-primary" onClick={handleStartNight}>
        Start Night Phase
      </button>
    </div>
  )
}
