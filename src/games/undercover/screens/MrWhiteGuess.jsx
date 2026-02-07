import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadGameState, saveGameState } from '../utils/gameState'

export default function MrWhiteGuess() {
  const navigate = useNavigate()
  const state = loadGameState()
  const [guess, setGuess] = useState('')

  if (!state) {
    navigate('/undercover')
    return null
  }

  const agentWord = state.agentWord

  function handleSubmit() {
    const correct = guess.trim().toLowerCase() === agentWord.toLowerCase()
    saveGameState({ ...state, winner: correct ? 'mr_white' : 'agents' })
    navigate('/undercover/winner')
  }

  return (
    <div className="screen uc-guess">
      <h2>Mr. White's Last Chance!</h2>
      <p>Guess the Agent's word to win!</p>
      <input
        type="text"
        placeholder="Your guess"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        autoFocus
      />
      <button type="button" className="btn-primary" onClick={handleSubmit}>
        Submit Guess
      </button>
    </div>
  )
}
