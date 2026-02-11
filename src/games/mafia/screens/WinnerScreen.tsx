import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { useMafia } from '../context/MafiaContext';

export function MafiaWinnerScreen() {
  const { state, dispatch } = useMafia();
  const navigate = useNavigate();

  const winnerLabel =
    state.winner === 'Civilians'
      ? 'Civilians Win! All Mafia have been eliminated!'
      : state.winner === 'Mafia'
        ? 'Mafia Wins! They have the numbers!'
        : state.winner === 'Jester'
          ? 'Jester Wins! They got what they wanted!'
          : 'Game Over';

  const onPlayAgain = () => {
    dispatch({ type: 'reset' });
    navigate('/mafia');
  };

  return (
    <div className="theme-mafia mafia-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Mafia</h2>
          <p className="home-tagline">{winnerLabel}</p>
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
          <button type="button" className="btn-primary" onClick={onPlayAgain}>
            Play Again
          </button>
        </section>
      </PageContainer>
    </div>
  );
}

