import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { getDb } from '../../../lib/firebase';

export type OddPlayerStatus = 'active' | 'eliminated';

export type OddPlayer = {
  id: string;
  name: string;
  isGameMaster: boolean;
  status: OddPlayerStatus;
  joinedAt: number;
};

export type TimerMode = 'idle' | 'running' | 'paused' | 'finished';

export type TimerState = {
  mode: TimerMode;
  questionShownAt: number | null;
  endsAt: number | null;
  durationMs: number;
  pausedAt: number | null;
};

export type QuestionTier = 'tier1_broad' | 'tier2_medium' | 'tier3_narrow';

export type RoundPhase = 'question' | 'review' | 'winner';

export type RoundState = {
  roundIndex: number;
  questionTier: QuestionTier;
  questionText: string;
  answers: Record<string, { text: string; submittedAt: number }>;
  phase: RoundPhase;
};

export type RoomStatus = 'lobby' | 'in_round' | 'review' | 'finished' | 'closed';

export type OddRoomDoc = {
  code: string;
  gameName: 'odd-one-in';
  createdAt: number;
  updatedAt: number;
  status: RoomStatus;
  players: OddPlayer[];
  gameMasterId: string;
  timer: TimerState;
  currentRound: RoundState | null;
  winners: string[];
};

export type Unsubscribe = () => void;

function roomsCollection() {
  return collection(getDb(), 'rooms');
}

function roomRef(code: string) {
  return doc(roomsCollection(), code);
}

function generateRoomCode() {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return String(num);
}

export async function createRoom(gameMasterName: string, playerId: string): Promise<OddRoomDoc> {
  const db = getDb();
  let code: string | null = null;

  // attempt a few times to avoid collisions
  for (let i = 0; i < 5; i += 1) {
    const candidate = generateRoomCode();
    const existing = await getDoc(doc(db, 'rooms', candidate));
    if (!existing.exists()) {
      code = candidate;
      break;
    }
  }

  if (!code) {
    throw new Error('Failed to generate unique room code. Please try again.');
  }

  const now = Date.now();
  const player: OddPlayer = {
    id: playerId,
    name: gameMasterName,
    isGameMaster: true,
    status: 'active',
    joinedAt: now
  };

  const room: OddRoomDoc = {
    code,
    gameName: 'odd-one-in',
    createdAt: now,
    updatedAt: now,
    status: 'lobby',
    players: [player],
    gameMasterId: playerId,
    timer: {
      mode: 'idle',
      questionShownAt: null,
      endsAt: null,
      durationMs: 10000,
      pausedAt: null
    },
    currentRound: null,
    winners: []
  };

  await setDoc(roomRef(code), {
    ...room,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return room;
}

export async function joinRoom(
  code: string,
  name: string,
  playerId: string
): Promise<OddRoomDoc> {
  const ref = roomRef(code);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error('Room not found');
  }
  const data = snap.data() as OddRoomDoc;
  if (data.status === 'closed') {
    throw new Error('Room is closed');
  }
  if (data.players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
    throw new Error('Name already taken in this room');
  }

  const now = Date.now();
  const player: OddPlayer = {
    id: playerId,
    name,
    isGameMaster: false,
    status: 'active',
    joinedAt: now
  };

  const updated: Partial<OddRoomDoc> = {
    players: [...data.players, player],
    updatedAt: now
  };

  await updateDoc(ref, {
    players: updated.players,
    updatedAt: serverTimestamp()
  });

  return { ...data, ...updated } as OddRoomDoc;
}

export async function kickPlayer(code: string, playerId: string) {
  const ref = roomRef(code);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as OddRoomDoc;
  const players = data.players.filter((p) => p.id !== playerId);
  await updateDoc(ref, {
    players,
    updatedAt: serverTimestamp()
  });
}

export async function closeRoom(code: string) {
  const ref = roomRef(code);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  await updateDoc(ref, {
    status: 'closed',
    updatedAt: serverTimestamp()
  });
}

export function subscribeToRoom(
  code: string,
  onChange: (room: OddRoomDoc | null) => void
): Unsubscribe {
  return onSnapshot(roomRef(code), (snap) => {
    if (!snap.exists()) {
      onChange(null);
      return;
    }
    const raw = snap.data() as any;
    // Firestore timestamps need to be normalised if used; for now, treat as ms where stored.
    const room: OddRoomDoc = {
      ...raw,
      createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : Date.now(),
      updatedAt: typeof raw.updatedAt === 'number' ? raw.updatedAt : Date.now()
    };
    onChange(room);
  });
}

export async function destroyRoom(code: string) {
  await deleteDoc(roomRef(code));
}

// --- Round & timer helpers ---

export async function startQuestionRound(
  code: string,
  questionTier: QuestionTier,
  questionText: string
) {
  const ref = roomRef(code);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as OddRoomDoc;

  const now = Date.now();
  const roundIndex = (data.currentRound?.roundIndex ?? 0) + 1;

  const timer: TimerState = {
    mode: 'running',
    questionShownAt: now,
    // 2s get-ready + 10s answer window
    endsAt: now + 12000,
    durationMs: 10000,
    pausedAt: null
  };

  const round: RoundState = {
    roundIndex,
    questionTier,
    questionText,
    answers: {},
    phase: 'question'
  };

  await updateDoc(ref, {
    currentRound: round,
    timer,
    status: 'in_round',
    updatedAt: serverTimestamp()
  });
}

export async function submitAnswer(
  code: string,
  playerId: string,
  text: string
) {
  const ref = roomRef(code);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as OddRoomDoc;
  const round = data.currentRound;
  if (!round || round.phase !== 'question') return;

  const answers = {
    ...round.answers,
    [playerId]: {
      text,
      submittedAt: Date.now()
    }
  };

  await updateDoc(ref, {
    'currentRound.answers': answers,
    updatedAt: serverTimestamp()
  });
}

export async function autoSubmitMissingAnswersAndReview(code: string) {
  const ref = roomRef(code);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as OddRoomDoc;
  const round = data.currentRound;
  if (!round) return;

  const now = Date.now();
  const activePlayers = data.players.filter((p) => p.status === 'active');
  const answers = { ...round.answers };

  activePlayers.forEach((p) => {
    if (!answers[p.id]) {
      answers[p.id] = {
        text: '',
        submittedAt: now
      };
    }
  });

  const updatedRound: RoundState = {
    ...round,
    answers,
    phase: 'review'
  };

  const timer: TimerState = {
    ...data.timer,
    mode: 'finished',
    pausedAt: null
  };

  await updateDoc(ref, {
    currentRound: updatedRound,
    timer,
    status: 'review',
    updatedAt: serverTimestamp()
  });
}

export async function pauseTimer(code: string) {
  const ref = roomRef(code);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as OddRoomDoc;
  if (data.timer.mode !== 'running') return;
  const now = Date.now();
  await updateDoc(ref, {
    'timer.mode': 'paused',
    'timer.pausedAt': now,
    updatedAt: serverTimestamp()
  });
}

export async function resumeTimer(code: string) {
  const ref = roomRef(code);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as OddRoomDoc;
  if (data.timer.mode !== 'paused' || !data.timer.pausedAt || !data.timer.endsAt) return;
  const now = Date.now();
  const diff = now - data.timer.pausedAt;
  await updateDoc(ref, {
    'timer.mode': 'running',
    'timer.pausedAt': null,
    'timer.endsAt': data.timer.endsAt + diff,
    updatedAt: serverTimestamp()
  });
}

export async function resetTimer(code: string) {
  const ref = roomRef(code);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const now = Date.now();
  await updateDoc(ref, {
    timer: {
      mode: 'running',
      questionShownAt: now,
      endsAt: now + 12000,
      durationMs: 10000,
      pausedAt: null
    },
    updatedAt: serverTimestamp()
  });
}

export async function eliminatePlayersAndMaybeFinish(
  code: string,
  eliminatedIds: string[]
) {
  const ref = roomRef(code);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as OddRoomDoc;

  const players = data.players.map((p) =>
    eliminatedIds.includes(p.id) ? { ...p, status: 'eliminated' as OddPlayerStatus } : p
  );

  const activePlayers = players.filter((p) => p.status === 'active');

  let status: RoomStatus = data.status;
  let winners: string[] = data.winners;
  let currentRound: RoundState | null = data.currentRound;
  let timer: TimerState = data.timer;

  if (activePlayers.length <= 2) {
    status = 'finished';
    winners = activePlayers.map((p) => p.id);
    if (currentRound) {
      currentRound = {
        ...currentRound,
        phase: 'winner'
      };
    }
  } else {
    // prepare for next question
    currentRound = null;
    timer = {
      ...timer,
      mode: 'idle',
      questionShownAt: null,
      endsAt: null,
      pausedAt: null
    };
    status = 'lobby';
  }

  await updateDoc(ref, {
    players,
    currentRound,
    timer,
    status,
    winners,
    updatedAt: serverTimestamp()
  });
}


