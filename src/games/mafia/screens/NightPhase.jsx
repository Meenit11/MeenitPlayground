import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadGameState, saveGameState } from '../utils/gameState'
import { ROLES } from '../constants/roles'

export default function NightPhase() {
  const navigate = useNavigate()
  const state = loadGameState()
  const [step, setStep] = useState(0)
  const [mafiaVictim, setMafiaVictim] = useState(null)
  const [doctorSave, setDoctorSave] = useState(null)
  const [detectiveTarget, setDetectiveTarget] = useState(null)
  const [loverProtection, setLoverProtection] = useState(null)

  if (!state) {
    navigate('/mafia')
    return null
  }

  const { players, round, loverProtection: existingLover } = state
  const alivePlayers = players.filter(p => p.alive)
  const hasLover = players.some(p => p.role === ROLES.LOVER && p.alive)
  const hasDetective = players.some(p => p.role === ROLES.DETECTIVE && p.alive)

  const steps = [
    { id: 'eyes', text: '🏙️ Everyone close your eyes' },
    { id: 'mafia', text: '🔪 Mafia wake up! Choose victim... Sleep' },
    { id: 'doctor', text: '😇 Doctor wake up! Who to save?... Sleep' },
    ...(hasDetective ? [{ id: 'detective', text: '🕵️ Detective wake up! Investigate... Sleep' }] : []),
    ...(round === 1 && hasLover ? [{ id: 'lover', text: '💖 Lover wake up! Choose protection... Sleep' }] : []),
  ]

  const currentStep = steps[step]

  function getSelectablePlayers(excludeRole = null) {
    return alivePlayers.filter(p => p.role !== excludeRole)
  }

  function handleSelect(player, setter) {
    setter(player)
  }

  function handleComplete() {
    const nightChoices = {
      mafia: mafiaVictim?.name,
      doctor: doctorSave?.name,
      detective: detectiveTarget?.name,
      lover: round === 1 && hasLover ? loverProtection?.name : existingLover,
    }
    saveGameState({
      ...state,
      nightChoices,
      loverProtection: round === 1 && hasLover ? loverProtection?.name : existingLover,
      phase: 'morning',
    })
    navigate('/mafia/morning')
  }

  const needsSelection = ['mafia', 'doctor', 'detective', 'lover'].includes(currentStep?.id)
  const selection = currentStep?.id === 'mafia' ? mafiaVictim
    : currentStep?.id === 'doctor' ? doctorSave
    : currentStep?.id === 'detective' ? detectiveTarget
    : currentStep?.id === 'lover' ? loverProtection
    : null

  const canAdvance = !needsSelection || selection

  return (
    <div className="screen mafia-night">
      <h2>🌙 Night Phase - Round {round}</h2>
      <p className="mafia-night__narration">Game Master: Read these aloud</p>
      <p className="mafia-night__step">{currentStep?.text}</p>

      {needsSelection && (
        <div className="mafia-night__grid">
          {getSelectablePlayers(currentStep?.id === 'lover' ? ROLES.LOVER : null).map((p) => (
            <button
              key={p.name}
              type="button"
              className={`mafia-night__card ${selection?.name === p.name ? 'selected' : ''}`}
              onClick={() => handleSelect(p, currentStep?.id === 'mafia' ? setMafiaVictim : currentStep?.id === 'doctor' ? setDoctorSave : currentStep?.id === 'detective' ? setDetectiveTarget : setLoverProtection)}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      <div className="mafia-night__actions">
        {step < steps.length - 1 ? (
          <button type="button" className="btn-primary" onClick={() => setStep(step + 1)} disabled={!canAdvance}>
            Next Step
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={handleComplete} disabled={!canAdvance}>
            Complete Night Phase
          </button>
        )}
      </div>
    </div>
  )
}
