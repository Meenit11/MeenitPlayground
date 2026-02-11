import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { useOddRoom } from '../context/OddRoomContext';

export function LobbyScreen() {
  const { code } = useParams<{ code: string }>();
  const { room, isGameMaster, kick, close, playerId } = useOddRoom();
  const navigate = useNavigate();

  const playerCount = room?.players.length ?? 0;

  const canStart = isGameMaster && playerCount >= 3;

  const inviteLink = useMemo(
    () => `${window.location.origin}/odd-one-in/join?room=${code}`,
    [code]
  );

  if (!room || !code || room.code !== code) {
    return (
      <div className="theme-odd odd-shell">
        <PageContainer>
          <p className="home-tagline">Room not found or loading…</p>
        </PageContainer>
      </div>
    );
  }

  if (room.status === 'closed') {
    return (
      <div className="theme-odd odd-shell">
        <PageContainer>
          <p className="home-tagline">This room has been closed by the Game Master.</p>
        </PageContainer>
      </div>
    );
  }

  const onShare = async () => {
    const message = `Join my Odd One In game! Room code: ${code}. Link: ${inviteLink}`;
    if (navigator.share) {
      await navigator.share({ text: message, url: inviteLink });
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      // eslint-disable-next-line no-alert
      alert('Invite link copied to clipboard');
    } catch {
      // eslint-disable-next-line no-alert
      alert('Could not copy link. Please copy it manually.');
    }
  };

  const onStartGame = () => {
    if (!canStart) return;
    navigate(`/odd-one-in/room/${code}/question`);
  };

  const gm = room.players.find((p) => p.id === room.gameMasterId);

  return (
    <div className="theme-odd odd-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Lobby</h2>
          <p className="home-tagline">Share the code and fill the room.</p>
        </header>

        <section className="home-section">
          <div className="game-card">
            <p className="game-card-title">Room code</p>
            <p className="game-card-tagline" style={{ fontSize: '1.2rem' }}>
              {code}
            </p>
            <div className="game-card-meta">
              <button type="button" className="btn-primary" onClick={onShare}>
                Share via WhatsApp
              </button>
              <button type="button" className="btn-ghost" onClick={onCopy}>
                Copy link
              </button>
            </div>
          </div>
        </section>

        <section className="home-section">
          <h3 className="section-title">
            Players ({playerCount}) {gm ? `— GM: ${gm.name}` : ''}
          </h3>
          <ul className="player-list">
            {room.players.map((p) => (
              <li key={p.id} className="player-row">
                <span>
                  {p.name}{' '}
                  {p.isGameMaster && (
                    <span role="img" aria-label="Game Master">
                      👑
                    </span>
                  )}
                  {p.id === playerId && <span className="badge badge-soft">You</span>}
                </span>
                {isGameMaster && !p.isGameMaster && (
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => kick(p.id)}
                    aria-label={`Remove ${p.name}`}
                  >
                    ❌
                  </button>
                )}
              </li>
            ))}
          </ul>
          {!isGameMaster && (
            <p className="home-tagline">Waiting for Game Master to start…</p>
          )}
        </section>

        {isGameMaster && (
          <section className="home-section">
            <button
              type="button"
              className="btn-primary"
              disabled={!canStart}
              onClick={onStartGame}
            >
              {canStart ? 'Start Game' : 'Need at least 3 players'}
            </button>
            <button
              type="button"
              className="btn-ghost"
              style={{ marginLeft: '0.5rem', marginTop: '0.5rem' }}
              onClick={async () => {
                await close();
                navigate('/');
              }}
            >
              Back to Home
            </button>
          </section>
        )}
      </PageContainer>
    </div>
  );
}

