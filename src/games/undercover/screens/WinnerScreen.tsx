import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { useUndercover } from '../context/UndercoverContext';

export function UndercoverWinnerScreen() {
  const { state, dispatch } = useUndercover();
  const navigate = useNavigate();

  const winnerLabel =
    state.winner === 'Agents'
      ? 'Agents Win!'
      : state.winner === 'Spy'
        ? 'Spy Wins!'
        : state.winner === 'MrWhite'
          ? 'Mr. White Wins!'
          : 'Game Over';

  const onPlayAgain = () => {
    dispatch({ type: 'reset' });
    navigate('/undercover');
  };

  return (
    <div className="theme-undercover under-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Undercover</h2>
          <p className="home-tagline">{winnerLabel}</p>
        </header>

        <section className="home-section">
          <p className="home-tagline">
            Agent word: <strong>{state.agentWord}</strong>
          </p>
          <p className="home-tagline">
            Spy word: <strong>{state.spyWord}</strong>
          </p>
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

