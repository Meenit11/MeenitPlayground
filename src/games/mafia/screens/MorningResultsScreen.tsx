import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { PaginatedList } from '../../../shared/PaginatedList';
import { useMafia } from '../context/MafiaContext';
import type { MafiaPlayer } from '../context/MafiaContext';

export function MafiaMorningResultsScreen() {
  const { state, dispatch } = useMafia();
  const navigate = useNavigate();
  const [victimId, setVictimId] = useState<string | null>(null);

  const alive = state.players.filter((p) => p.isAlive);

  const onNoOneDied = () => {
    dispatch({ type: 'setNightOutcome', deathIds: [] });
    navigate('/mafia/day');
  };

  const onSomeoneDied = () => {
    if (!victimId) return;
    const deathIds = [victimId];
    dispatch({ type: 'setNightOutcome', deathIds });
    navigate('/mafia/day');
  };

  return (
    <div className="theme-mafia mafia-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Morning Results</h2>
          <p className="home-tagline">Everyone wake up! From your notes, who (if anyone) did not survive? Lover and Doctor outcomes are already in your notes.</p>
        </header>

        <section className="home-section">
          <button type="button" className="btn-primary" onClick={onNoOneDied}>
            No One Died
          </button>
        </section>

        <section className="home-section">
          <p className="home-tagline">Or select who died tonight:</p>
          <PaginatedList<MafiaPlayer>
            items={alive}
            pageSize={6}
            keyFn={(p) => p.id}
            getItemClassName={(p) =>
              `player-row ${victimId === p.id ? 'player-row-selected' : ''}`
            }
            emptyMessage="No players."
            renderItem={(p) => (
              <span
                role="button"
                tabIndex={0}
                style={{ display: 'block', width: '100%' }}
                onClick={() => setVictimId(p.id)}
                onKeyDown={(ev) =>
                  (ev.key === 'Enter' || ev.key === ' ') && setVictimId(p.id)
                }
              >
                {p.name}
              </span>
            )}
          />
          <button
            type="button"
            className="btn-ghost"
            disabled={!victimId}
            onClick={onSomeoneDied}
          >
            Confirm Death
          </button>
        </section>
      </PageContainer>
    </div>
  );
}

