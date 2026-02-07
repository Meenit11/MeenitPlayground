import { useNavigate } from 'react-router-dom'
import { loadGameState, saveGameState } from '../utils/gameState'

export default function GameStart() {
  const navigate = useNavigate()
  const state = loadGameState()
  if (!state) {
    navigate('/undercover')
    return null
  }

  const alivePlayers = state.players.filter(p => p.alive)
  const currentSpeaker = alivePlayers[state.currentSpeakerIndex % alivePlayers.length]

  function handleEliminate() {
    navigate('/undercover/eliminate')
  }

  function handleEndGame() {
    const alive = state.players.filter(p => p.alive)
    const spiesAlive = alive.filter(p => p.role === 'spy').length
    const mrWhiteAlive = alive.filter(p => p.role === 'mr_white').length
    let winner = 'agents'
    if (mrWhiteAlive === 0 && alive.length >= 2 && alive.length <= 3 && spiesAlive > 0) winner = 'spy'
    saveGameState({ ...state, winner })
    navigate('/undercover/winner')
  }

  return (
    <div className="screen uc-game-start">
      <h2>🎮 Game Begins!</h2>
      <p className="uc-game-start__speaker">Current Speaker: <strong>{currentSpeaker?.name}</strong></p>
      <p className="uc-game-start__instructions">
        Describe your word in 1-2 words. Then vote to eliminate ONE player.
      </p>
      <button type="button" className="btn-primary" onClick={handleEliminate}>
        Eliminate Player
      </button>
      <button type="button" className="uc-game-start__end" onClick={handleEndGame}>
        End Game
      </button>
    </div>
  )
}
