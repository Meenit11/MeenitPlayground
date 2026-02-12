import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { PaginatedList } from '../../../shared/PaginatedList';
import { useOddRoom } from '../context/OddRoomContext';
import { eliminatePlayersAndMaybeFinish, OddPlayer } from '../services/oddBackend';

type DisplayAnswer = {
  player: OddPlayer;
  text: string;
};

export function AnswerReviewScreen() {
  const { code } = useParams<{ code: string }>();
  const { room, isGameMaster, isKicked, leaveRoom } = useOddRoom();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!room || !code || room.code !== code || !room.currentRound) {
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

  const { answers } = room.currentRound;

  const byPlayerId = new Map(room.players.map((p) => [p.id, p]));

  const allEntries: DisplayAnswer[] = useMemo(
    () =>
      Object.entries(answers).map(([playerId, answer]) => ({
        player: byPlayerId.get(playerId)!,
        text: (answer.text ?? '').trim()
      })),
    [answers, byPlayerId]
  );

  const blanks = allEntries.filter((e) => e.text === '');
  const nonBlanks = allEntries.filter((e) => e.text !== '');

  nonBlanks.sort((a, b) => a.text.localeCompare(b.text, undefined, { sensitivity: 'base' }));

  const freq = new Map<string, number>();
  nonBlanks.forEach((e) => {
    const key = e.text.toLowerCase();
    freq.set(key, (freq.get(key) ?? 0) + 1);
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const activePlayers = room.players.filter((p) => p.status === 'active');

  const onApplyDecision = async (eliminate: boolean) => {
    if (!code) return;
    if (eliminate && selectedIds.length) {
      await eliminatePlayersAndMaybeFinish(code, selectedIds);
    }
    const remainingActive =
      eliminate && selectedIds.length
        ? activePlayers.filter((p) => !selectedIds.includes(p.id)).length
        : activePlayers.length;
    if (remainingActive <= 2) {
      navigate(`/odd-one-in/room/${code}/winner`);
    } else {
      navigate(`/odd-one-in/room/${code}/question`);
    }
  };

  return (
    <div className="theme-odd odd-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Answer Review</h2>
          <p className="home-tagline">Blank answers first, then sorted responses.</p>
        </header>

        <section className="home-section">
          <h3 className="section-title">No Answers</h3>
          <PaginatedList<DisplayAnswer>
            items={blanks}
            pageSize={6}
            keyFn={(e) => e.player.id}
            itemClassName="player-row"
            getItemClassName={(e) =>
              `player-row ${selectedIds.includes(e.player.id) ? 'player-row-selected' : ''}`
            }
            emptyMessage="No blanks this round."
            renderItem={(entry) => (
              <span
                role="button"
                tabIndex={0}
                style={{ display: 'block', width: '100%' }}
                onClick={() => isGameMaster && toggleSelect(entry.player.id)}
                onKeyDown={(ev) =>
                  isGameMaster && (ev.key === 'Enter' || ev.key === ' ') && toggleSelect(entry.player.id)
                }
              >
                {entry.player.name} | (No Answer)
              </span>
            )}
          />
        </section>

        <section className="home-section">
          <h3 className="section-title">Answers</h3>
          <PaginatedList<DisplayAnswer>
            items={nonBlanks}
            pageSize={6}
            keyFn={(e) => e.player.id}
            getItemClassName={(entry) => {
              const key = entry.text.toLowerCase();
              const isDuplicate = (freq.get(key) ?? 0) > 1;
              return `player-row ${selectedIds.includes(entry.player.id) ? 'player-row-selected' : ''} ${isDuplicate ? 'player-row-duplicate' : ''}`;
            }}
            emptyMessage="No answers this round."
            renderItem={(entry) => (
              <span
                role="button"
                tabIndex={0}
                style={{ display: 'block', width: '100%' }}
                onClick={() => isGameMaster && toggleSelect(entry.player.id)}
                onKeyDown={(ev) =>
                  isGameMaster && (ev.key === 'Enter' || ev.key === ' ') && toggleSelect(entry.player.id)
                }
              >
                {entry.player.name} | {entry.text}
              </span>
            )}
          />
        </section>

        {isGameMaster && (
          <section className="home-section">
            <button
              type="button"
              className="btn-primary"
              onClick={() => onApplyDecision(true)}
            >
              Eliminate Selected Players
            </button>
            <button
              type="button"
              className="btn-ghost"
              style={{ marginLeft: '0.5rem', marginTop: '0.5rem' }}
              onClick={() => onApplyDecision(false)}
            >
              Next Round (No Elimination)
            </button>
          </section>
        )}
      </PageContainer>
    </div>
  );
}

