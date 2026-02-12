import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { PaginatedList } from '../../../shared/PaginatedList';
import { useMafia } from '../context/MafiaContext';
import type { MafiaPlayer } from '../context/MafiaContext';

export function MafiaNightPhaseScreen() {
  const { state, dispatch } = useMafia();
  const navigate = useNavigate();
  const [loverTargetId, setLoverTargetId] = useState<string | null>(state.loverTargetId);

  const alive = state.players.filter((p) => p.isAlive);
  const mafiaPlayers = alive.filter((p) => p.role === 'Mafia');
  const doctor = alive.find((p) => p.role === 'Doctor');
  const detective = alive.find((p) => p.role === 'Detective');
  const lover = alive.find((p) => p.role === 'Lover');
  const loverTargetCandidates = useMemo(
    () => (lover ? alive.filter((p) => p.id !== lover.id) : []),
    [alive, lover]
  );

  const onComplete = () => {
    if (lover && !state.loverTargetId && loverTargetId) {
      dispatch({ type: 'setLoverTarget', playerId: loverTargetId });
    }
    navigate('/mafia/morning');
  };

  return (
    <div className="theme-mafia mafia-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Night Phase – Round {state.round}</h2>
          <p className="home-tagline">Game Master: read these steps aloud. All actions are silent with eyes closed.</p>
        </header>

        <section className="home-section">
          <p className="home-tagline">Everyone close your eyes.</p>

          {mafiaPlayers.length > 0 && (
            <div className="home-section">
              <p className="home-tagline">
                Mafia, wake up! Silently point to choose your victim. Then go back to sleep.
              </p>
              <p className="home-tagline" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                (GM notes who was chosen mentally – do not tap in the app.)
              </p>
            </div>
          )}

          {doctor && (
            <div className="home-section">
              <p className="home-tagline">
                Doctor, wake up! Silently point to who you want to save tonight. Then go back to sleep.
              </p>
              <p className="home-tagline" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                (GM notes who was saved mentally – do not tap in the app.)
              </p>
            </div>
          )}

          {detective && (
            <div className="home-section">
              <p className="home-tagline">
                Detective, wake up! Point at a player. GM will nod (yes) or shake head (no) if that player is Mafia. Then go back to sleep.
              </p>
            </div>
          )}

          {lover && state.round === 1 && !state.loverTargetId && (
            <div className="home-section">
              <p className="home-tagline">
                Lover wake up! Choose who you want to protect permanently, then go back to sleep.
              </p>
              <PaginatedList<MafiaPlayer>
                items={loverTargetCandidates}
                pageSize={6}
                keyFn={(p) => p.id}
                getItemClassName={(p) =>
                  `player-row ${loverTargetId === p.id ? 'player-row-selected' : ''}`
                }
                emptyMessage="No one to protect."
                renderItem={(p) => (
                  <span
                    role="button"
                    tabIndex={0}
                    style={{ display: 'block', width: '100%' }}
                    onClick={() => setLoverTargetId(p.id)}
                    onKeyDown={(ev) =>
                      (ev.key === 'Enter' || ev.key === ' ') && setLoverTargetId(p.id)
                    }
                  >
                    {p.name}
                  </span>
                )}
              />
            </div>
          )}
        </section>

        <section className="home-section">
          <button type="button" className="btn-primary" onClick={onComplete}>
            Complete Night Phase
          </button>
        </section>
      </PageContainer>
    </div>
  );
}
