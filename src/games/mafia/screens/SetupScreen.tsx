import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMafia } from '../context/MafiaContext';
import { Modal } from '../../../shared/Modal';
import { MafiaRules } from '../MafiaRules';

const SETUP_STEP_NAMES = 0;
const SETUP_STEP_ROLES = 1;

export function MafiaSetupScreen() {
  const { state, dispatch } = useMafia();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [names, setNames] = useState<string[]>(state.playerNames.length ? state.playerNames : Array.from({ length: state.totalPlayers }, () => ''));
  const [showRules, setShowRules] = useState(false);

  const civilians = useMemo(() => {
    const specials =
      1 +
      state.mafiaCount +
      (state.detectiveEnabled ? 1 : 0) +
      (state.jesterEnabled ? 1 : 0) +
      (state.bomberEnabled ? 1 : 0) +
      (state.loverEnabled ? 1 : 0);
    return state.totalPlayers - specials;
  }, [state]);

  const onNameChange = (index: number, value: string) => {
    const copy = [...names];
    copy[index] = value;
    setNames(copy);
  };

  const onNextToRoles = () => {
    const trimmedNames = names.map((n) => n.trim());
    if (trimmedNames.some((n) => !n)) return;
    const uniq = new Set(trimmedNames);
    if (uniq.size !== trimmedNames.length) return;
    if (!state.gameMasterName.trim()) return;
    dispatch({ type: 'setPlayerNames', names: trimmedNames });
    setStep(SETUP_STEP_ROLES);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step === SETUP_STEP_NAMES) {
      onNextToRoles();
      return;
    }
    if (civilians < 1) return;
    dispatch({ type: 'startGame' });
    navigate('/mafia/roles');
  };

  const onToggle =
    (type: 'toggleDetective' | 'toggleJester' | 'toggleBomber' | 'toggleLover') => () =>
      dispatch({ type });

  const onTotalChange = (delta: number) => {
    const next = Math.min(15, Math.max(5, state.totalPlayers + delta));
    dispatch({ type: 'setTotal', total: next });
    if (next > names.length) {
      setNames([...names, ...Array.from({ length: next - names.length }, () => '')]);
    } else if (next < names.length) {
      setNames(names.slice(0, next));
    }
  };

  const namesError =
    names.some((n) => !n.trim()) ? 'Please enter all player names!' : '';
  const gmError = !state.gameMasterName.trim()
    ? 'Please select who will be the Game Master!'
    : '';
  const duplicateError =
    new Set(names.map((n) => n.trim())).size !== names.length
      ? 'Each player must have a unique name!'
      : '';
  const civiliansError =
    civilians < 1 ? 'Too many special roles! Reduce roles or increase total players.' : '';

  const namesStepValid =
    !names.some((n) => !n.trim()) &&
    new Set(names.map((n) => n.trim())).size === names.length &&
    state.gameMasterName.trim().length > 0;

  return (
    <form className="home-section" onSubmit={onSubmit}>
      <div className="form-label" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          Setup {step === SETUP_STEP_NAMES ? '1/2' : '2/2'}
        </h2>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setShowRules(true)}
          style={{ fontSize: '0.8rem' }}
        >
          How to play
        </button>
      </div>

      {step === SETUP_STEP_NAMES && (
        <>
          <div className="form-label">
            <span>Total players</span>
            <div className="counter-row">
              <button type="button" className="btn-ghost" onClick={() => onTotalChange(-1)}>
                -
              </button>
              <span>{state.totalPlayers}</span>
              <button type="button" className="btn-ghost" onClick={() => onTotalChange(1)}>
                +
              </button>
            </div>
          </div>

          <div className="form-label">
            <span>Player names</span>
            {names.map((name, idx) => (
              <input
                key={idx}
                type="text"
                className="input"
                value={name}
                onChange={(e) => onNameChange(idx, e.target.value)}
                placeholder={`Player ${idx + 1}`}
              />
            ))}
          </div>

          <div className="form-label">
            <span>Game Master (does not play)</span>
            <input
              type="text"
              className="input"
              value={state.gameMasterName}
              onChange={(e) =>
                dispatch({ type: 'setGameMasterName', name: e.target.value })
              }
              placeholder="Game Master name"
            />
          </div>

          {namesError && <p className="error-text">{namesError}</p>}
          {gmError && <p className="error-text">{gmError}</p>}
          {duplicateError && <p className="error-text">{duplicateError}</p>}

          <button
            type="button"
            className="btn-primary"
            disabled={!namesStepValid}
            onClick={onNextToRoles}
          >
            Next: Roles
          </button>
        </>
      )}

      {step === SETUP_STEP_ROLES && (
        <>
          <div className="form-label">
            <span>Roles</span>
            <div className="role-row">
              <span>Doctor (fixed)</span>
              <span>1</span>
            </div>
            <div className="role-row">
              <span>Mafia</span>
              <div className="counter-row">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() =>
                    dispatch({
                      type: 'setMafiaCount',
                      count: Math.max(0, state.mafiaCount - 1)
                    })
                  }
                >
                  -
                </button>
                <span>{state.mafiaCount}</span>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() =>
                    dispatch({
                      type: 'setMafiaCount',
                      count: Math.min(5, state.mafiaCount + 1)
                    })
                  }
                >
                  +
                </button>
              </div>
            </div>
            <div className="role-row">
              <span>Detective</span>
              <button type="button" className="btn-ghost" onClick={onToggle('toggleDetective')}>
                {state.detectiveEnabled ? 'On' : 'Off'}
              </button>
            </div>
            <div className="role-row">
              <span>Jester</span>
              <button type="button" className="btn-ghost" onClick={onToggle('toggleJester')}>
                {state.jesterEnabled ? 'On' : 'Off'}
              </button>
            </div>
            <div className="role-row">
              <span>Bomber</span>
              <button type="button" className="btn-ghost" onClick={onToggle('toggleBomber')}>
                {state.bomberEnabled ? 'On' : 'Off'}
              </button>
            </div>
            <div className="role-row">
              <span>Lover</span>
              <button type="button" className="btn-ghost" onClick={onToggle('toggleLover')}>
                {state.loverEnabled ? 'On' : 'Off'}
              </button>
            </div>
            <div className="role-row">
              <span>Civilians</span>
              <span>{civilians}</span>
            </div>
          </div>

          {civiliansError && <p className="error-text">{civiliansError}</p>}

          <button
            type="button"
            className="btn-ghost"
            style={{ marginBottom: '0.5rem' }}
            onClick={() => setStep(SETUP_STEP_NAMES)}
          >
            ← Back to names
          </button>
          <button
            className="btn-primary"
            type="submit"
            disabled={civilians < 1}
          >
            Start Game
          </button>
        </>
      )}

      <Modal title="How to play Mafia" open={showRules} onClose={() => setShowRules(false)}>
        <MafiaRules />
      </Modal>
    </form>
  );
}

