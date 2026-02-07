import { useNavigate } from 'react-router-dom'
import { loadGameState } from '../utils/gameState'

export default function RoleViewing() {
  const navigate = useNavigate()
  const state = loadGameState()
  if (!state) {
    navigate('/mafia')
    return null
  }

  const { players, currentViewIndex } = state
  const currentPlayer = players[currentViewIndex]

  function handleReveal() {
    navigate('/mafia/role-display')
  }

  return (
    <div className="screen mafia-role-view">
      <h2>Role Assignment</h2>
      <p className="mafia-role-view__pass">Pass phone to <strong>{currentPlayer.name}</strong></p>
      <p className="mafia-role-view__look">Everyone else: look away! 👀</p>
      <button type="button" className="btn-primary" onClick={handleReveal}>
        👁️ Reveal My Role
      </button>
    </div>
  )
}
