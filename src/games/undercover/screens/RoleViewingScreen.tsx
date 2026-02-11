import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { useUndercover } from '../context/UndercoverContext';

export function RoleViewingScreen() {
  const { state, dispatch } = useUndercover();
  const navigate = useNavigate();

  const currentId = state.viewingOrder[state.viewingIndex];
  const player = state.players.find((p) => p.id === currentId);
  const nextId = state.viewingOrder[state.viewingIndex + 1];
  const nextPlayer = state.players.find((p) => p.id === nextId);

  if (!player) {
    navigate('/undercover');
    return null;
  }

  const onRevealDone = () => {
    dispatch({ type: 'nextViewer' });
    if (state.viewingIndex + 1 >= state.viewingOrder.length) {
      navigate('/undercover/play');
    }
  };

  return (
    <div className="theme-undercover under-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Role Assignment</h2>
          <p className="home-tagline">
            Pass the phone to <strong>{player.name}</strong>. Everyone else close your eyes!
          </p>
        </header>

        <section className="home-section">
          {player.role === 'MrWhite' ? (
            <div className="game-card">
              <img src="/images/Mr White.png" alt="Mr. White" className="game-card-logo" />
              <h3 className="game-card-title">You&apos;re Mr. White</h3>
              <p className="home-tagline">Blend in and guess the word!</p>
              <div className="home-section">
                <p className="home-tagline">You see NO WORD. Listen carefully to others.</p>
              </div>
            </div>
          ) : (
            <div className="game-card">
              <img src="/images/Spy Agent.png" alt="Agent / Spy" className="game-card-logo" />
              <h3 className="game-card-title">Agent / Spy</h3>
              <p className="home-tagline">You may be Agent or Spy. Be clever!</p>
              <div className="home-section">
                <p className="home-tagline" style={{ fontSize: '1.1rem' }}>
                  Your word: <strong>{player.word}</strong>
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="home-section">
          <button type="button" className="btn-primary" onClick={onRevealDone}>
            {nextPlayer ? `Pass phone to ${nextPlayer.name}` : 'Start Game'}
          </button>
        </section>
      </PageContainer>
    </div>
  );
}

