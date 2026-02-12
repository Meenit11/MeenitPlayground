import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { PaginatedList } from '../../../shared/PaginatedList';
import { useMafia } from '../context/MafiaContext';
import type { MafiaPlayer } from '../context/MafiaContext';

export function MafiaDayPhaseScreen() {
  const { state, dispatch } = useMafia();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const alive = state.players.filter((p) => p.isAlive);

  const onConfirm = () => {
    if (!selectedId) return;
    dispatch({ type: 'eliminateDay', playerId: selectedId, cause: 'vote' });
    if (state.winner) {
      navigate('/mafia/winner');
    } else {
      navigate('/mafia/night');
    }
  };

  const onSkip = () => {
    dispatch({ type: 'skipToNight' });
    navigate('/mafia/night');
  };

  return (
    <div className="theme-mafia mafia-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Day Phase – Round {state.round}</h2>
          <p className="home-tagline">Discuss and vote to eliminate ONE player.</p>
        </header>

        <section className="home-section">
          <PaginatedList<MafiaPlayer>
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
            Confirm Elimination
          </button>
          <button
            type="button"
            className="btn-ghost"
            style={{ marginLeft: '0.5rem', marginTop: '0.5rem' }}
            onClick={onSkip}
          >
            Skip Elimination
          </button>
        </section>
      </PageContainer>
    </div>
  );
}

