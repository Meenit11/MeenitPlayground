import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { PaginatedList } from '../../../shared/PaginatedList';
import { useOddRoom } from '../context/OddRoomContext';
import type { OddPlayer } from '../services/oddBackend';

export function LobbyScreen() {
  const { code } = useParams<{ code: string }>();
  const { room, isGameMaster, isKicked, kick, close, leaveRoom, playerId } = useOddRoom();
  const navigate = useNavigate();
  const [copyFeedback, setCopyFeedback] = useState<'idle' | 'copied' | 'error'>('idle');

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

  const onShare = async () => {
    const message = `Join my Odd One In game! Room code: ${code}. Link: ${inviteLink}`;
    if (navigator.share) {
      await navigator.share({ text: message, url: inviteLink });
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopyFeedback('copied');
    } catch {
      setCopyFeedback('error');
    }
  }, [inviteLink]);

  useEffect(() => {
    if (copyFeedback === 'idle') return;
    const t = setTimeout(() => setCopyFeedback('idle'), 2000);
    return () => clearTimeout(t);
  }, [copyFeedback]);

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button type="button" className="btn-ghost" onClick={onCopy}>
                  Copy link
                </button>
                {copyFeedback === 'copied' && (
                  <span className="home-tagline" style={{ margin: 0, color: 'var(--accent-2)' }}>Copied!</span>
                )}
                {copyFeedback === 'error' && (
                  <span className="home-tagline" style={{ margin: 0, color: 'var(--accent)' }}>
                    Could not copy. Copy the link manually.
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="home-section">
          <h3 className="section-title">
            Players ({playerCount}) {gm ? `— GM: ${gm.name}` : ''}
          </h3>
          <PaginatedList<OddPlayer>
            items={room.players}
            pageSize={6}
            keyFn={(p) => p.id}
            itemClassName="player-row"
            emptyMessage="No players yet"
            renderItem={(p) => (
              <>
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
              </>
            )}
          />
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

