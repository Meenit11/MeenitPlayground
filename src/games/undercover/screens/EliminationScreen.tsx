import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PageContainer } from '../../../shared/PageContainer';
import { useUndercover } from '../context/UndercoverContext';

export function UndercoverEliminationScreen() {
  const { state, dispatch } = useUndercover();
  const navigate = useNavigate();
  const alive = state.players.filter((p) => p.isAlive);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const onConfirm = () => {
    if (!selectedId) return;
    dispatch({ type: 'eliminate', playerId: selectedId });
    const eliminated = state.players.find((p) => p.id === selectedId);
    if (eliminated?.role === 'MrWhite') {
      navigate('/undercover/mr-white-guess');
    } else if (state.winner) {
      navigate('/undercover/winner');
    } else {
      navigate('/undercover/reveal');
    }
  };

  return (
    <div className="theme-undercover under-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Eliminate Player</h2>
          <p className="home-tagline">Select exactly one player to eliminate.</p>
        </header>

        <section className="home-section">
          <ul className="player-list">
            {alive.map((p) => (
              <li
                key={p.id}
                className={`player-row ${selectedId === p.id ? 'player-row-selected' : ''}`}
                onClick={() => setSelectedId(p.id)}
              >
                <span>{p.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-section">
          <button
            type="button"
            className="btn-primary"
            disabled={!selectedId}
            onClick={onConfirm}
          >
            Eliminate Selected Player
          </button>
        </section>
      </PageContainer>
    </div>
  );
}

