import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { useOddRoom } from '../context/OddRoomContext';
import questionsData from '../../../../data/questions.json';
import type { QuestionTier, OddPlayer } from '../services/oddBackend';
import {
  autoSubmitMissingAnswersAndReview,
  pauseTimer,
  resetTimer,
  resumeTimer,
  startQuestionRound,
  submitAnswer
} from '../services/oddBackend';

function pickQuestion(tier: QuestionTier) {
  const tierData = (questionsData as any)[tier];
  const list: string[] = tierData?.questions ?? [];
  if (!list.length) return 'No questions configured for this tier.';
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

export function QuestionScreen() {
  const { code } = useParams<{ code: string }>();
  const { room, playerId, isGameMaster, isKicked, leaveRoom } = useOddRoom();
  const navigate = useNavigate();
  const [localAnswer, setLocalAnswer] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(t);
  }, []);

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

  const activePlayers = room.players.filter((p) => p.status === 'active');

  // Decide tier based on active player count
  const questionTier: QuestionTier =
    activePlayers.length >= 10
      ? 'tier1_broad'
      : activePlayers.length >= 5
        ? 'tier2_medium'
        : 'tier3_narrow';

  const questionText = useMemo(() => pickQuestion(questionTier), [questionTier]);

  // Game Master creates a round if one does not exist
  useEffect(() => {
    if (!room || !code) return;
    if (!isGameMaster) return;
    if (room.currentRound && room.currentRound.phase === 'question') return;
    void startQuestionRound(code, questionTier, questionText);
  }, [code, isGameMaster, questionText, questionTier, room]);

  const timer = room.timer;
  const questionShownAt = timer.questionShownAt ?? Date.now();
  const readyUntil = questionShownAt + 2000;
  const endsAt = timer.endsAt ?? readyUntil + 10000;

  const inReady = now < readyUntil;
  const remaining = Math.max(0, Math.ceil((endsAt - now) / 1000));
  const showUrgent = !inReady && remaining <= 3;

  const currentPlayer: OddPlayer | undefined = room.players.find((p) => p.id === playerId);
  const isEliminated = currentPlayer?.status === 'eliminated';

  const submitted =
    !!playerId && !!room.currentRound?.answers && !!room.currentRound.answers[playerId];

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code || !playerId) return;
    if (submitted || isEliminated) return;
    await submitAnswer(code, playerId, localAnswer);
  };

  // GM auto-advances when timer ends
  useEffect(() => {
    if (!isGameMaster || !code) return;
    if (timer.mode !== 'running') return;
    if (remaining > 0 || inReady) return;
    void autoSubmitMissingAnswersAndReview(code).then(() => {
      navigate(`/odd-one-in/room/${code}/review`);
    });
  }, [code, inReady, isGameMaster, navigate, remaining, timer.mode]);

  return (
    <div className="theme-odd odd-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Question Round</h2>
          <p className="home-tagline">{questionText}</p>
        </header>

        <section className="home-section">
          <div className={`timer-pill ${showUrgent ? 'timer-pill-urgent' : ''}`}>
            {inReady ? 'Get ready…' : `Time left: ${remaining}s`}
          </div>
        </section>

        <section className="home-section">
          <form onSubmit={onSubmit}>
            <label className="form-label">
              Your answer
              <input
                type="text"
                className="input"
                disabled={submitted || isEliminated || inReady}
                value={localAnswer}
                onChange={(e) => setLocalAnswer(e.target.value)}
                placeholder={isEliminated ? 'Eliminated' : 'Type quickly!'}
              />
            </label>
            <button
              className="btn-primary"
              type="submit"
              disabled={submitted || isEliminated || inReady}
            >
              {submitted ? 'Answer Submitted' : 'Submit Answer'}
            </button>
          </form>
        </section>

        {isGameMaster && (
          <section className="home-section">
            <p className="home-tagline">Game Master controls</p>
            <div className="home-game-list">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  if (timer.mode === 'running') void pauseTimer(code);
                  else if (timer.mode === 'paused') void resumeTimer(code);
                }}
              >
                {timer.mode === 'paused' ? 'Resume Timer' : 'Pause Timer'}
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  void resetTimer(code);
                }}
              >
                Reset Timer
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  void autoSubmitMissingAnswersAndReview(code).then(() => {
                    navigate(`/odd-one-in/room/${code}/review`);
                  });
                }}
              >
                Skip Question
              </button>
            </div>
          </section>
        )}
      </PageContainer>
    </div>
  );
}

