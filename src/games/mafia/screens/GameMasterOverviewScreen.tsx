import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { useMafia } from '../context/MafiaContext';

export function MafiaGameMasterOverviewScreen() {
  const { state } = useMafia();
  const navigate = useNavigate();

  const onStartNight = () => {
    navigate('/mafia/night');
  };

  return (
    <div className="theme-mafia mafia-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Game Master Overview</h2>
          <p className="home-tagline">Do NOT show this screen to players.</p>
        </header>

        <section className="home-section">
          <ul className="player-list">
            {state.players.map((p) => (
              <li key={p.id} className="player-row">
                <span>
                  {p.name} – {p.role}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-section">
          <button type="button" className="btn-primary" onClick={onStartNight}>
            Start Night Phase
          </button>
        </section>
      </PageContainer>
    </div>
  );
}

