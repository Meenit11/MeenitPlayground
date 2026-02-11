import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { useUndercover } from '../context/UndercoverContext';

export function UndercoverGameStartScreen() {
  const { state, dispatch } = useUndercover();
  const navigate = useNavigate();

  const alive = state.players.filter((p) => p.isAlive);
  const speaker = alive.length
    ? alive[Math.floor(Math.random() * alive.length)]
    : undefined;

  const onEliminate = () => {
    dispatch({ type: 'goElimination' });
    navigate('/undercover/eliminate');
  };

  const onEnd = () => {
    dispatch({ type: 'reset' });
    navigate('/undercover');
  };

  return (
    <div className="theme-undercover under-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Game Begins</h2>
          <p className="home-tagline">
            Current speaker:{' '}
            <strong>{speaker ? speaker.name : 'Pick anyone to start'}</strong>
          </p>
        </header>

        <section className="home-section">
          <p className="home-tagline">
            Describe your word in 1–2 words. Then everyone votes to eliminate ONE suspicious
            player. Mr. White has no word – if they&apos;re caught, they can still win by
            guessing the Agents&apos; word.
          </p>
        </section>

        <section className="home-section">
          <button type="button" className="btn-primary" onClick={onEliminate}>
            Eliminate Player
          </button>
          <button
            type="button"
            className="btn-ghost"
            style={{ marginLeft: '0.5rem', marginTop: '0.5rem' }}
            onClick={onEnd}
          >
            End Game
          </button>
        </section>
      </PageContainer>
    </div>
  );
}

