import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/Button'
import { ROLES, ROLE_INFO } from '../constants/roles'
import { saveGameState } from '../utils/gameState'

export default function Setup() {
  const navigate = useNavigate()
  const [totalPlayers, setTotalPlayers] = useState(8)
  const [mafiaCount, setMafiaCount] = useState(1)
  const [hasDetective, setHasDetective] = useState(true)
  const [hasJester, setHasJester] = useState(false)
  const [hasBomber, setHasBomber] = useState(false)
  const [hasLover, setHasLover] = useState(false)
  const [gameMasterName, setGameMasterName] = useState('')
  const [playerNames, setPlayerNames] = useState(Array(8).fill(''))
  useEffect(() => {
    setPlayerNames(prev => {
      const next = [...prev]
      while (next.length < totalPlayers) next.push('')
      return next.slice(0, totalPlayers)
    })
  }, [totalPlayers])
  const [rulesOpen, setRulesOpen] = useState(false)
  const [error, setError] = useState('')

  const specialCount = (hasDetective ? 1 : 0) + (hasJester ? 1 : 0) + (hasBomber ? 1 : 0) + (hasLover ? 1 : 0)
  const civilianCount = totalPlayers - 1 - mafiaCount - specialCount // 1 = Doctor (always)

  function setPlayerName(i, name) {
    const next = [...playerNames]
    next[i] = name
    setPlayerNames(next)
  }

  function handleStart() {
    setError('')
    const names = playerNames.slice(0, totalPlayers).map(n => n.trim())
    if (names.some(n => !n)) {
      setError("Fill in all player names. No ghosts allowed!")
      return
    }
    const unique = new Set(names.map(n => n.toLowerCase()))
    if (unique.size !== names.length) {
      setError("No duplicate names! We need to know who's who.")
      return
    }
    if (!gameMasterName.trim()) {
      setError("Pick a Game Master! Someone's gotta narrate this chaos.")
      return
    }
    if (civilianCount < 1) {
      setError("Need at least 1 Civilian. Adjust your roles!")
      return
    }

    const roles = [ROLES.DOCTOR] // Always include Doctor
    for (let i = 0; i < mafiaCount; i++) roles.push(ROLES.MAFIA)
    if (hasDetective) roles.push(ROLES.DETECTIVE)
    if (hasJester) roles.push(ROLES.JESTER)
    if (hasBomber) roles.push(ROLES.BOMBER)
    if (hasLover) roles.push(ROLES.LOVER)
    for (let i = 0; i < civilianCount; i++) roles.push(ROLES.CIVILIAN)

    // Shuffle roles
    for (let i = roles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roles[i], roles[j]] = [roles[j], roles[i]]
    }

    const players = names.map((name, i) => ({
      name,
      role: roles[i],
      alive: true,
    }))

    const viewOrder = [...Array(players.length).keys()]
    for (let i = viewOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [viewOrder[i], viewOrder[j]] = [viewOrder[j], viewOrder[i]]
    }

    saveGameState({
      players,
      gameMasterName: gameMasterName.trim(),
      currentViewIndex: 0,
      round: 1,
      phase: 'role_viewing',
      nightChoices: {},
      loverProtection: null,
    })
    navigate('/mafia/role-view')
  }

  return (
    <div className="screen mafia-setup">
      <Link to="/" className="back-btn">← Back</Link>
      <img src="/images/Mafia Logo.png" alt="Mafia" className="logo-small" />
      <p className="tagline">Trust no one. Not even yourself. Especially yourself.</p>

      <div className="mafia-setup__total">
        <span>Total Players (5-15)</span>
        <div className="mafia-setup__counter">
          <button type="button" onClick={() => setTotalPlayers(Math.max(5, totalPlayers - 1))}>−</button>
          <span>{totalPlayers}</span>
          <button type="button" onClick={() => setTotalPlayers(Math.min(15, totalPlayers + 1))}>+</button>
        </div>
      </div>

      <label>Player Names</label>
      {Array.from({ length: totalPlayers }, (_, i) => (
        <input
          key={i}
          placeholder={`Player ${i + 1}`}
          value={playerNames[i] || ''}
          onChange={(e) => setPlayerName(i, e.target.value)}
        />
      ))}

      <label>Game Master (doesn't play)</label>
      <input
        placeholder="Who narrates?"
        value={gameMasterName}
        onChange={(e) => setGameMasterName(e.target.value)}
      />

      <div className="mafia-setup__roles">
        <div className="mafia-setup__role-row">
          <span>Mafia (0-5)</span>
          <div className="mafia-setup__counter">
            <button type="button" onClick={() => setMafiaCount(Math.max(0, mafiaCount - 1))}>−</button>
            <span>{mafiaCount}</span>
            <button type="button" onClick={() => setMafiaCount(Math.min(5, mafiaCount + 1))}>+</button>
          </div>
        </div>
        <div className="mafia-setup__role-row">
          <span>Detective</span>
          <button type="button" className={`mafia-setup__toggle ${hasDetective ? 'on' : ''}`} onClick={() => setHasDetective(!hasDetective)}>
            {hasDetective ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="mafia-setup__role-row">
          <span>Jester</span>
          <button type="button" className={`mafia-setup__toggle ${hasJester ? 'on' : ''}`} onClick={() => setHasJester(!hasJester)}>
            {hasJester ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="mafia-setup__role-row">
          <span>Bomber</span>
          <button type="button" className={`mafia-setup__toggle ${hasBomber ? 'on' : ''}`} onClick={() => setHasBomber(!hasBomber)}>
            {hasBomber ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="mafia-setup__role-row">
          <span>Lover</span>
          <button type="button" className={`mafia-setup__toggle ${hasLover ? 'on' : ''}`} onClick={() => setHasLover(!hasLover)}>
            {hasLover ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="mafia-setup__role-row">
          <span>Civilians (auto)</span>
          <span>{civilianCount}</span>
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <Button onClick={handleStart}>Start Game</Button>
      <button type="button" className="mafia-setup__rules" onClick={() => setRulesOpen(!rulesOpen)}>
        Rules
      </button>
      <Link to="/" style={{ marginTop: 12, display: 'block' }}>
        <Button variant="secondary">Back to Home</Button>
      </Link>

      {rulesOpen && (
        <div className="mafia-setup__rules-modal">
          <p>Game Master narrates, doesn't play. Night: Mafia kills, Doctor saves, Detective investigates, Lover protects (Round 1 only). Day: Discuss and vote to eliminate. Civilians win when all Mafia dead. Mafia wins when they outnumber others. Jester wins if voted out. Bomber takes someone with them when voted out.</p>
          <button type="button" onClick={() => setRulesOpen(false)}>Close</button>
        </div>
      )}
    </div>
  )
}
