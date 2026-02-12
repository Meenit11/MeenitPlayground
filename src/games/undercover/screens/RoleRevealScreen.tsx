import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { useUndercover } from '../context/UndercoverContext';

export function UndercoverRoleRevealScreen() {
  const { state, dispatch } = useUndercover();
  const navigate = useNavigate();

  const eliminated = state.players.find((p) => p.id === state.eliminatedPlayerId);

  if (!eliminated) {
    navigate('/undercover/play');
    return null;
  }

  const onContinue = () => {
    dispatch({ type: 'revealDone' });
    if (state.winner) {
      navigate('/undercover/winner');
    } else {
      navigate('/undercover/play');
    }
  };

  const roleImage =
    eliminated.role === 'MrWhite'
      ? '/images/Mr White.png'
      : eliminated.role === 'Spy'
        ? '/images/Spy.png'
        : '/images/Agent.png';

  const roleLabel =
    eliminated.role === 'MrWhite' ? 'Mr. White' : eliminated.role === 'Spy' ? 'Spy' : 'Agent';

  return (
    <div className="theme-undercover under-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Player Eliminated</h2>
          <p className="home-tagline">Their true role is revealed. The word is not shown.</p>
        </header>

        <section className="home-section">
          <div className="game-card">
            <img src={roleImage} alt={roleLabel} className="game-card-logo" />
            <h3 className="game-card-title">{eliminated.name}</h3>
            <p className="home-tagline">Role: {roleLabel}</p>
          </div>
        </section>

        <section className="home-section">
          <button type="button" className="btn-primary" onClick={onContinue}>
            Continue Game
          </button>
        </section>
      </PageContainer>
    </div>
  );
}

