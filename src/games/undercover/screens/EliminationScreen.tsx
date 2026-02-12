import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PageContainer } from '../../../shared/PageContainer';
import { PaginatedList } from '../../../shared/PaginatedList';
import { useUndercover } from '../context/UndercoverContext';
import type { UndercoverPlayer } from '../context/UndercoverContext';

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
          <PaginatedList<UndercoverPlayer>
            items={alive}
            pageSize={6}
            keyFn={(p) => p.id}
            getItemClassName={(p) =>
              `player-row ${selectedId === p.id ? 'player-row-selected' : ''}`
            }
            emptyMessage="No players."
            renderItem={(p) => (
              <span
                role="button"
                tabIndex={0}
                style={{ display: 'block', width: '100%' }}
                onClick={() => setSelectedId(p.id)}
                onKeyDown={(ev) =>
                  (ev.key === 'Enter' || ev.key === ' ') && setSelectedId(p.id)
                }
              >
                {p.name}
              </span>
            )}
          />
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

