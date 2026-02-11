import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { useMafia } from '../context/MafiaContext';

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
          <p className="home-tagline">Everyone wake up! See who survived the night.</p>
        </header>

        <section className="home-section">
          <button type="button" className="btn-primary" onClick={onNoOneDied}>
            No One Died
          </button>
        </section>

        <section className="home-section">
          <p className="home-tagline">Or select who died:</p>
          <ul className="player-list">
            {alive.map((p) => (
              <li
                key={p.id}
                className={`player-row ${victimId === p.id ? 'player-row-selected' : ''}`}
                onClick={() => setVictimId(p.id)}
              >
                <span>{p.name}</span>
              </li>
            ))}
          </ul>
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

