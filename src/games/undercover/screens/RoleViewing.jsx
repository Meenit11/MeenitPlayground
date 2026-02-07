import { useNavigate } from 'react-router-dom'
import { loadGameState } from '../utils/gameState'

export default function RoleViewing() {
  const navigate = useNavigate()
  const state = loadGameState()
  if (!state) {
    navigate('/undercover')
    return null
  }

  const { players, currentViewIndex } = state
  const currentPlayer = players[currentViewIndex]

  function handleReveal() {
    navigate('/undercover/role-display')
  }

  return (
    <div className="screen uc-role-view">
      <h2>Role Assignment</h2>
      <p className="uc-role-view__pass">Pass phone to <strong>{currentPlayer.name}</strong></p>
      <p className="uc-role-view__look">Everyone else: look away! 👀</p>
      <button type="button" className="btn-primary uc-role-view__btn" onClick={handleReveal}>
        👁️ Reveal My Role
      </button>
    </div>
  )
}
