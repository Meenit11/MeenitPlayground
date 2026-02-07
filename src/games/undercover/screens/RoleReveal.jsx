import { useNavigate } from 'react-router-dom'
import { loadGameState, saveGameState } from '../utils/gameState'

const ROLE_IMAGES = {
  mr_white: "/images/Mr. White.png",
  spy: "/images/Spy.png",
  agent: "/images/Agent.png",
}

const ROLE_NAMES = {
  mr_white: "Mr. White",
  spy: "Spy",
  agent: "Agent",
}

export default function RoleReveal() {
  const navigate = useNavigate()
  const state = loadGameState()
  if (!state) {
    navigate('/undercover')
    return null
  }

  const { eliminatedPlayer } = state
  const player = state.players.find(p => p.name === eliminatedPlayer?.name)
  if (!player) {
    navigate('/undercover/game')
    return null
  }

  const isMrWhite = player.role === 'mr_white'

  function handleMrWhiteGuess() {
    navigate('/undercover/guess')
  }

  function handleContinue() {
    const alive = state.players.filter(p => p.alive)
    const agentsAlive = alive.filter(p => p.role === 'agent').length
    const spiesAlive = alive.filter(p => p.role === 'spy').length
    const mrWhiteAlive = alive.filter(p => p.role === 'mr_white').length

    // Agents win: all Mr. White dead AND all Spy dead
    if (mrWhiteAlive === 0 && spiesAlive === 0) {
      saveGameState({ ...state, winner: 'agents' })
      navigate('/undercover/winner')
      return
    }

    // Spy wins: Mr. White dead AND 2-3 players left AND Spy alive
    if (mrWhiteAlive === 0 && alive.length >= 2 && alive.length <= 3 && spiesAlive > 0) {
      saveGameState({ ...state, winner: 'spy' })
      navigate('/undercover/winner')
      return
    }

    // Continue game - find next alive speaker (cycle through players)
    let nextIdx = (state.currentSpeakerIndex + 1) % state.players.length
    for (let i = 0; i < state.players.length; i++) {
      if (state.players[nextIdx].alive) break
      nextIdx = (nextIdx + 1) % state.players.length
    }
    saveGameState({ ...state, currentSpeakerIndex: nextIdx })
    navigate('/undercover/game')
  }

  return (
    <div className="screen uc-reveal">
      <h2>Player Eliminated</h2>
      <h3>{player.name}</h3>
      <img src={ROLE_IMAGES[player.role]} alt={ROLE_NAMES[player.role]} className="uc-reveal__img" />
      <p className="uc-reveal__role">{ROLE_NAMES[player.role]}</p>

      {isMrWhite ? (
        <button type="button" className="btn-primary" onClick={handleMrWhiteGuess}>
          Mr. White Guesses
        </button>
      ) : (
        <button type="button" className="btn-primary" onClick={handleContinue}>
          Continue Game
        </button>
      )}
    </div>
  )
}
