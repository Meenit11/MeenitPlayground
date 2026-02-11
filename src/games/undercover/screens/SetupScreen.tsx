import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUndercover } from '../context/UndercoverContext';
import { Modal } from '../../../shared/Modal';
import { UndercoverRules } from '../UndercoverRules';

export function UndercoverSetupScreen() {
  const { state, dispatch } = useUndercover();
  const navigate = useNavigate();
  const [nameInput, setNameInput] = useState('');
  const [showRules, setShowRules] = useState(false);

  const agents = useMemo(
    () => state.totalPlayers - state.mrWhiteCount - state.spyCount,
    [state.totalPlayers, state.mrWhiteCount, state.spyCount]
  );

  const addName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    if (state.names.length >= state.totalPlayers) return;
    if (state.names.includes(trimmed)) return;
    dispatch({ type: 'setNames', names: [...state.names, trimmed] });
    setNameInput('');
  };

  const removeName = (name: string) => {
    dispatch({ type: 'setNames', names: state.names.filter((n) => n !== name) });
  };

  const adjustMrWhite = (delta: number) => {
    let next = Math.max(0, state.mrWhiteCount + delta);
    let spy = state.spyCount;
    let total = state.totalPlayers;
    // Ensure agents > (MrWhite + Spy)
    while (total - next - spy <= next + spy) {
      total += 1;
    }
    dispatch({ type: 'setTotal', total });
    dispatch({ type: 'setMrWhite', count: next });
  };

  const adjustSpy = (delta: number) => {
    let next = Math.max(0, state.spyCount + delta);
    let mrw = state.mrWhiteCount;
    let total = state.totalPlayers;
    while (total - mrw - next <= mrw + next) {
      total += 1;
    }
    dispatch({ type: 'setTotal', total });
    dispatch({ type: 'setSpy', count: next });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const total = state.totalPlayers;
    const namesOk = state.names.length === total;
    const hasSpecial = state.mrWhiteCount > 0 || state.spyCount > 0;
    const agentsCount = total - state.mrWhiteCount - state.spyCount;
    const constraintOk = agentsCount > state.mrWhiteCount + state.spyCount;
    if (!namesOk || !hasSpecial || !constraintOk) return;
    dispatch({ type: 'startGame' });
    navigate('/undercover/roles');
  };

  const namesError =
    state.names.length !== state.totalPlayers
      ? `Please add exactly ${state.totalPlayers} player names!`
      : '';
  const specialError =
    state.mrWhiteCount === 0 && state.spyCount === 0
      ? 'You need at least 1 Mr. White OR 1 Spy!'
      : '';
  const constraintError =
    agents <= state.mrWhiteCount + state.spyCount
      ? 'Agents must be greater than Spy + Mr. White combined!'
      : '';

  const hasError = !!namesError || !!specialError || !!constraintError;

  return (
    <form className="home-section" onSubmit={onSubmit}>
      <div className="form-label" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          Setup
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

      <div className="form-label">
        <span>Total players</span>
        <div className="counter-row">
          <button
            type="button"
            className="btn-ghost"
            onClick={() =>
              dispatch({ type: 'setTotal', total: Math.max(4, state.totalPlayers - 1) })
            }
          >
            -
          </button>
          <span>{state.totalPlayers}</span>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => dispatch({ type: 'setTotal', total: state.totalPlayers + 1 })}
          >
            +
          </button>
        </div>
      </div>

      <div className="form-label">
        <span>Player names</span>
        <div className="name-input-row">
          <input
            type="text"
            className="input"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Type name and press Add"
          />
          <button type="button" className="btn-primary" onClick={addName}>
            Add
          </button>
        </div>
        <div className="chip-row">
          {state.names.map((name) => (
            <button
              type="button"
              key={name}
              className="chip"
              onClick={() => removeName(name)}
            >
              {name} ×
            </button>
          ))}
        </div>
      </div>

      <div className="form-label">
        <span>Roles</span>
        <div className="role-row">
          <span>Mr. White</span>
          <div className="counter-row">
            <button type="button" className="btn-ghost" onClick={() => adjustMrWhite(-1)}>
              -
            </button>
            <span>{state.mrWhiteCount}</span>
            <button type="button" className="btn-ghost" onClick={() => adjustMrWhite(1)}>
              +
            </button>
          </div>
        </div>
        <div className="role-row">
          <span>Spy</span>
          <div className="counter-row">
            <button type="button" className="btn-ghost" onClick={() => adjustSpy(-1)}>
              -
            </button>
            <span>{state.spyCount}</span>
            <button type="button" className="btn-ghost" onClick={() => adjustSpy(1)}>
              +
            </button>
          </div>
        </div>
        <div className="role-row">
          <span>Agents</span>
          <span>{agents}</span>
        </div>
      </div>

      {namesError && <p className="error-text">{namesError}</p>}
      {specialError && <p className="error-text">{specialError}</p>}
      {constraintError && <p className="error-text">{constraintError}</p>}

      <button className="btn-primary" type="submit" disabled={hasError}>
        Start Game
      </button>

      <Modal title="How to play Undercover" open={showRules} onClose={() => setShowRules(false)}>
        <UndercoverRules />
      </Modal>
    </form>
  );
}

