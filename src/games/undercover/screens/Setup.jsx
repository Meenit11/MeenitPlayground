import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../../../components/Button'
import { fetchWords, getRandomWordPair } from '../utils/words'
import { saveGameState } from '../utils/gameState'

const ROLES = { MR_WHITE: 'mr_white', SPY: 'spy', AGENT: 'agent' }

export default function Setup() {
  const navigate = useNavigate()
  const [totalPlayers, setTotalPlayers] = useState(6)
  const [mrWhiteCount, setMrWhiteCount] = useState(1)
  const [spyCount, setSpyCount] = useState(0)
  const [playerNames, setPlayerNames] = useState([])
  const [currentName, setCurrentName] = useState('')
  const [rulesOpen, setRulesOpen] = useState(false)
  const [error, setError] = useState('')

  const agentCount = Math.max(0, totalPlayers - mrWhiteCount - spyCount)
  const minTotal = mrWhiteCount + spyCount + 2 // agents must be >= 2
  const validatedTotal = totalPlayers < minTotal ? minTotal : totalPlayers

  function addPlayer() {
    const name = currentName.trim()
    if (!name) return
    if (playerNames.length >= validatedTotal) return
    setPlayerNames([...playerNames, name])
    setCurrentName('')
  }

  function removePlayer(i) {
    setPlayerNames(playerNames.filter((_, idx) => idx !== i))
  }

  async function handleStart() {
    setError('')
    if (playerNames.length !== validatedTotal) {
      setError(`Need exactly ${validatedTotal} names. You have ${playerNames.length}. No cheating!`)
      return
    }
    if (mrWhiteCount === 0 && spyCount === 0) {
      setError("Someone's gotta be the Spy or Mr. White. Spice it up!")
      return
    }
    if (agentCount <= 0) {
      setError("Agents must outnumber the others. Basic math!")
      return
    }

    try {
      const wordsData = await fetchWords()
      const pair = getRandomWordPair(wordsData)
      if (!pair) {
        setError("Word database is empty. Someone forgot to load the words!")
        return
      }

      // Random coin flip: which word is Agent vs Spy
      const flip = Math.random() < 0.5
      const agentWord = flip ? pair[0] : pair[1]
      const spyWord = flip ? pair[1] : pair[0]

      const roles = []
      for (let i = 0; i < mrWhiteCount; i++) roles.push(ROLES.MR_WHITE)
      for (let i = 0; i < spyCount; i++) roles.push(ROLES.SPY)
      for (let i = 0; i < agentCount; i++) roles.push(ROLES.AGENT)

      // Shuffle roles
      for (let i = roles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roles[i], roles[j]] = [roles[j], roles[i]]
      }

      const playerAssignments = playerNames.map((name, i) => ({
        name,
        role: roles[i],
        word: roles[i] === ROLES.MR_WHITE ? null : (roles[i] === ROLES.SPY ? spyWord : agentWord),
        alive: true,
      }))

      const startIndex = Math.floor(Math.random() * playerNames.length)

      saveGameState({
        agentWord,
        spyWord,
        players: playerAssignments,
        currentViewIndex: 0,
        startIndex,
        phase: 'role_viewing',
      })
      navigate('/undercover/role-view')
    } catch (err) {
      setError(err.message || "Something went wrong. The spies are to blame.")
    }
  }

  return (
    <div className="screen uc-setup">
      <Link to="/" className="back-btn">← Back</Link>
      <img src="/images/Undercover Logo.png" alt="Undercover" className="logo-small" />
      <p className="tagline">Lie, guess, survive - one word changes everything!</p>

      <div className="uc-setup__total">
        <span>Total Players</span>
        <div className="uc-setup__counter">
          <button type="button" onClick={() => setTotalPlayers(Math.max(4, totalPlayers - 1))}>−</button>
          <span>{validatedTotal}</span>
          <button type="button" onClick={() => setTotalPlayers(totalPlayers + 1)}>+</button>
        </div>
      </div>

      <div className="uc-setup__names">
        <label>Player Names (press Enter to add)</label>
        <div className="uc-setup__input-row">
          <input
            type="text"
            placeholder="Name"
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
          />
          <button type="button" className="uc-setup__add" onClick={addPlayer}>Add</button>
        </div>
        <div className="uc-setup__chips">
          {playerNames.map((n, i) => (
            <span key={i} className="uc-setup__chip">
              {n} <button type="button" onClick={() => removePlayer(i)}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="uc-setup__roles">
        <div className="uc-setup__role-row">
          <span>Mr. White</span>
          <div className="uc-setup__counter">
            <button type="button" onClick={() => setMrWhiteCount(Math.max(0, mrWhiteCount - 1))}>−</button>
            <span>{mrWhiteCount}</span>
            <button type="button" onClick={() => setMrWhiteCount(mrWhiteCount + 1)}>+</button>
          </div>
        </div>
        <div className="uc-setup__role-row">
          <span>Spy</span>
          <div className="uc-setup__counter">
            <button type="button" onClick={() => setSpyCount(Math.max(0, spyCount - 1))}>−</button>
            <span>{spyCount}</span>
            <button type="button" onClick={() => setSpyCount(spyCount + 1)}>+</button>
          </div>
        </div>
        <div className="uc-setup__role-row">
          <span>Agents (auto)</span>
          <span>{agentCount}</span>
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <Button onClick={handleStart}>Start Game</Button>
      <button type="button" className="uc-setup__rules" onClick={() => setRulesOpen(!rulesOpen)}>
        Rules
      </button>
      <Link to="/" style={{ marginTop: 12, display: 'block' }}>
        <Button variant="secondary">Back to Home</Button>
      </Link>

      {rulesOpen && (
        <div className="uc-setup__rules-modal">
          <p>Agents get one word, Spy gets a similar word. Mr. White gets nothing. Describe your word in 1-2 words. Vote to eliminate one player each round. Mr. White can guess the word if eliminated. Agents win by eliminating all spies (and Mr. White if needed). Spy wins by surviving with 2-3 players left. Mr. White wins by guessing the word!</p>
          <button type="button" onClick={() => setRulesOpen(false)}>Close</button>
        </div>
      )}
    </div>
  )
}
