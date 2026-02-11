import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { useMafia } from '../context/MafiaContext';

export function MafiaNightPhaseScreen() {
  const { state, dispatch } = useMafia();
  const navigate = useNavigate();
  const [mafiaTargetId, setMafiaTargetId] = useState<string | null>(null);
  const [doctorSaveId, setDoctorSaveId] = useState<string | null>(null);
  const [loverTargetId, setLoverTargetId] = useState<string | null>(state.loverTargetId);

  const alive = state.players.filter((p) => p.isAlive);
  const mafiaPlayers = alive.filter((p) => p.role === 'Mafia');
  const doctor = alive.find((p) => p.role === 'Doctor');
  const lover = alive.find((p) => p.role === 'Lover');

  const onComplete = () => {
    // For simplicity, we let GM manually choose actual death(s) in Morning screen.
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
          <p className="home-tagline">Game Master: read these steps aloud.</p>
        </header>

        <section className="home-section">
          <p className="home-tagline">Everyone close your eyes.</p>
          {mafiaPlayers.length > 0 && (
            <div className="home-section">
              <p className="home-tagline">
                Mafia wake up! Silently point to choose your victim, then go back to sleep.
              </p>
              <ul className="player-list">
                {alive.map((p) => (
                  <li
                    key={p.id}
                    className={`player-row ${mafiaTargetId === p.id ? 'player-row-selected' : ''}`}
                    onClick={() => setMafiaTargetId(p.id)}
                  >
                    <span>{p.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {doctor && (
            <div className="home-section">
              <p className="home-tagline">
                Doctor wake up! Point to who you want to save tonight, then go back to sleep.
              </p>
              <ul className="player-list">
                {alive.map((p) => (
                  <li
                    key={p.id}
                    className={`player-row ${doctorSaveId === p.id ? 'player-row-selected' : ''}`}
                    onClick={() => setDoctorSaveId(p.id)}
                  >
                    <span>{p.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lover && state.round === 1 && !state.loverTargetId && (
            <div className="home-section">
              <p className="home-tagline">
                Lover wake up! Point to who you want to protect permanently, then go back to
                sleep.
              </p>
              <ul className="player-list">
                {alive
                  .filter((p) => p.id !== lover.id)
                  .map((p) => (
                    <li
                      key={p.id}
                      className={`player-row ${loverTargetId === p.id ? 'player-row-selected' : ''}`}
                      onClick={() => setLoverTargetId(p.id)}
                    >
                      <span>{p.name}</span>
                    </li>
                  ))}
              </ul>
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

