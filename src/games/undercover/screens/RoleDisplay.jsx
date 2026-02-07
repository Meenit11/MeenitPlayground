import { useNavigate } from 'react-router-dom'
import { loadGameState, saveGameState } from '../utils/gameState'

export default function RoleDisplay() {
  const navigate = useNavigate()
  const state = loadGameState()
  if (!state) {
    navigate('/undercover')
    return null
  }

  const { players, currentViewIndex } = state
  const currentPlayer = players[currentViewIndex]
  const isLast = currentViewIndex === players.length - 1

  function handleNext() {
    if (isLast) {
      const nextState = { ...state, phase: 'game', currentSpeakerIndex: state.startIndex }
      saveGameState(nextState)
      navigate('/undercover/game')
    } else {
      const nextState = { ...state, currentViewIndex: currentViewIndex + 1 }
      saveGameState(nextState)
      navigate('/undercover/role-view')
    }
  }

  const isMrWhite = currentPlayer.role === 'mr_white'

  return (
    <div className="screen uc-role-display">
      {isMrWhite ? (
        <>
          <img src="/images/Mr. White.png" alt="Mr. White" className="uc-role-display__img" />
          <h2>You're Mr. White</h2>
          <p>Blend in and guess the word!</p>
          <p className="uc-role-display__no-word">(No word - you're the wildcard!)</p>
        </>
      ) : (
        <>
          <img src="/images/Spy Agent.png" alt="Agent/Spy" className="uc-role-display__img" />
          <h2>Agent / Spy</h2>
          <p>You may be Agent or Spy. Be clever!</p>
          <p className="uc-role-display__word">Your word: <strong>{currentPlayer.word}</strong></p>
        </>
      )}

      <button type="button" className="btn-primary" onClick={handleNext}>
        {isLast ? 'Start Game' : `Pass Phone to ${players[currentViewIndex + 1]?.name}`}
      </button>
    </div>
  )
}
