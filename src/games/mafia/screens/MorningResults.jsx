import { useNavigate } from 'react-router-dom'
import { loadGameState, saveGameState } from '../utils/gameState'

export default function MorningResults() {
  const navigate = useNavigate()
  const state = loadGameState()
  if (!state) {
    navigate('/mafia')
    return null
  }

  const { players, nightChoices, loverProtection } = state
  const mafiaVictimName = nightChoices?.mafia
  const doctorSave = nightChoices?.doctor
  const victim = players.find(p => p.name === mafiaVictimName)
  const lover = players.find(p => p.role === 'lover')

  const doctorSavedVictim = doctorSave === mafiaVictimName
  const loverProtectedVictim = loverProtection === mafiaVictimName && lover?.alive

  let actualVictim = null
  if (!doctorSavedVictim && mafiaVictimName) {
    actualVictim = loverProtectedVictim ? lover : victim
  }

  function handleContinue() {
    if (actualVictim) {
      const updated = players.map(p =>
        p.name === actualVictim.name ? { ...p, alive: false } : p
      )
      saveGameState({ ...state, players: updated, phase: 'day' })
    } else {
      saveGameState({ ...state, phase: 'day' })
    }
    navigate('/mafia/day')
  }

  return (
    <div className="screen mafia-morning">
      <h2>☀️ Morning Results</h2>
      <p className="mafia-morning__wake">EVERYONE wake up!</p>

      {actualVictim ? (
        <>
          <p className="mafia-morning__msg">RIP {actualVictim.name}</p>
          {loverProtectedVictim && (
            <p className="mafia-morning__hint">Lover protected the target - Lover sacrificed themselves!</p>
          )}
        </>
      ) : (
        <p className="mafia-morning__msg">
          {doctorSavedVictim ? 'No one died! Doctor saved the day! 🩺' : 'No one died tonight!'}
        </p>
      )}

      <button type="button" className="btn-primary" onClick={handleContinue}>
        Start Discussion
      </button>
    </div>
  )
}
