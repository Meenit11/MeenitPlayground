import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { useOddRoom } from '../context/OddRoomContext';

export function WinnerScreen() {
  const { code } = useParams<{ code: string }>();
  const { room, isKicked, leaveRoom } = useOddRoom();
  const navigate = useNavigate();

  if (!room || !code || room.code !== code) {
    return (
      <div className="theme-odd odd-shell">
        <PageContainer>
          <p className="home-tagline">Loading room…</p>
        </PageContainer>
      </div>
    );
  }

  if (isKicked) {
    return (
      <div className="theme-odd odd-shell">
        <PageContainer>
          <p className="home-tagline">You were removed from the room.</p>
          <div className="home-section">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                leaveRoom();
                navigate('/odd-one-in/join');
              }}
            >
              Join another room
            </button>
            <button
              type="button"
              className="btn-ghost"
              style={{ marginTop: '0.5rem' }}
              onClick={() => {
                leaveRoom();
                navigate('/');
              }}
            >
              Back to Home
            </button>
          </div>
        </PageContainer>
      </div>
    );
  }

  const winners = useMemo(
    () => room.players.filter((p) => p.status === 'active'),
    [room.players]
  );

  const winnerText =
    winners.length === 1
      ? `Winner: ${winners[0]?.name}!`
      : winners.length === 2
        ? `Winners: ${winners[0]?.name} & ${winners[1]?.name}!`
        : 'Game over!';

  const onPlayAgain = () => {
    navigate(`/odd-one-in/room/${code}/lobby`);
  };

  const onHome = () => {
    navigate('/');
  };

  return (
    <div className="theme-odd odd-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Odd One In</h2>
          <p className="home-tagline">{winnerText}</p>
        </header>
        <section className="home-section">
          <button type="button" className="btn-primary" onClick={onPlayAgain}>
            Play Again
          </button>
          <button
            type="button"
            className="btn-ghost"
            style={{ marginLeft: '0.5rem' }}
            onClick={onHome}
          >
            Go to Home
          </button>
        </section>
      </PageContainer>
    </div>
  );
}

