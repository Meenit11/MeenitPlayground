import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { useMafia } from '../context/MafiaContext';

export function MafiaRoleViewingScreen() {
  const { state } = useMafia();
  const navigate = useNavigate();

  // For simplicity, we show a static message instructing the GM to pass the phone
  // to each player in order and reveal roles manually using this overview.
  // Full per-player hidden viewing could be added similarly to Undercover.

  const onDone = () => {
    navigate('/mafia/overview');
  };

  return (
    <div className="theme-mafia mafia-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Role Assignment</h2>
          <p className="home-tagline">
            Pass the phone to each player so they can privately see their role.
          </p>
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
          <button type="button" className="btn-primary" onClick={onDone}>
            Pass Phone to Game Master
          </button>
        </section>
      </PageContainer>
    </div>
  );
}

