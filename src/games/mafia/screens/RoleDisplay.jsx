import { useNavigate } from 'react-router-dom'
import { loadGameState, saveGameState } from '../utils/gameState'
import { ROLE_INFO } from '../constants/roles'

export default function RoleDisplay() {
  const navigate = useNavigate()
  const state = loadGameState()
  if (!state) {
    navigate('/mafia')
    return null
  }

  const { players, currentViewIndex, gameMasterName } = state
  const currentPlayer = players[currentViewIndex]
  const isLast = currentViewIndex === players.length - 1
  const info = ROLE_INFO[currentPlayer.role]

  function handleNext() {
    if (isLast) {
      saveGameState({ ...state, phase: 'gm_overview' })
      navigate('/mafia/gm-overview')
    } else {
      saveGameState({ ...state, currentViewIndex: currentViewIndex + 1 })
      navigate('/mafia/role-view')
    }
  }

  return (
    <div className="screen mafia-role-display">
      <img src={info.image} alt={info.name} className="mafia-role-display__img" />
      <h2>{info.name}</h2>
      <p className="mafia-role-display__desc">{info.description}</p>
      <button type="button" className="btn-primary" onClick={handleNext}>
        {isLast ? `Pass Phone to ${gameMasterName}` : `Pass Phone to ${players[currentViewIndex + 1]?.name}`}
      </button>
    </div>
  )
}
