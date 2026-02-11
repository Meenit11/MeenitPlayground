import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react';
import words from '../../../data/words.json';

type Role = 'Agent' | 'Spy' | 'MrWhite';

export type UndercoverPlayer = {
  id: string;
  name: string;
  role: Role;
  displayRole: 'MrWhite' | 'AgentOrSpy';
  word: string | null;
  isAlive: boolean;
};

export type UndercoverPhase =
  | 'setup'
  | 'roleViewing'
  | 'gameStart'
  | 'elimination'
  | 'roleReveal'
  | 'mrWhiteGuess'
  | 'winner';

export type UndercoverState = {
  phase: UndercoverPhase;
  players: UndercoverPlayer[];
  totalPlayers: number;
  names: string[];
  mrWhiteCount: number;
  spyCount: number;
  agentWord: string;
  spyWord: string;
  viewingOrder: string[];
  viewingIndex: number;
  eliminatedPlayerId: string | null;
  winner: 'Agents' | 'Spy' | 'MrWhite' | null;
};

type Action =
  | { type: 'reset' }
  | { type: 'setTotal'; total: number }
  | { type: 'setNames'; names: string[] }
  | { type: 'setMrWhite'; count: number }
  | { type: 'setSpy'; count: number }
  | { type: 'startGame' }
  | { type: 'nextViewer' }
  | { type: 'startPlay' }
  | { type: 'goElimination' }
  | { type: 'eliminate'; playerId: string }
  | { type: 'revealDone'; winner?: UndercoverState['winner'] }
  | { type: 'mrWhiteGuess'; correct: boolean };

const LOCAL_KEY = 'undercover-state-v1';

const initialState: UndercoverState = {
  phase: 'setup',
  players: [],
  totalPlayers: 4,
  names: [],
  mrWhiteCount: 1,
  spyCount: 0,
  agentWord: '',
  spyWord: '',
  viewingOrder: [],
  viewingIndex: 0,
  eliminatedPlayerId: null,
  winner: null
};

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildRoles(state: UndercoverState) {
  const { totalPlayers, mrWhiteCount, spyCount } = state;
  const roles: Role[] = [];
  for (let i = 0; i < mrWhiteCount; i += 1) roles.push('MrWhite');
  for (let i = 0; i < spyCount; i += 1) roles.push('Spy');
  const agents = totalPlayers - mrWhiteCount - spyCount;
  for (let i = 0; i < agents; i += 1) roles.push('Agent');
  return roles;
}

function assignRoles(state: UndercoverState): UndercoverState {
  const pair = randomChoice(words.word_pairs);
  const flip = Math.random() < 0.5;
  const agentWord = flip ? pair[0] : pair[1];
  const spyWord = flip ? pair[1] : pair[0];

  const roles = shuffle(buildRoles(state));

  const players: UndercoverPlayer[] = state.names.map((name, idx) => {
    const role = roles[idx];
    return {
      id: `${Date.now()}-${idx}`,
      name,
      role,
      displayRole: role === 'MrWhite' ? 'MrWhite' : 'AgentOrSpy',
      word: role === 'MrWhite' ? null : role === 'Spy' ? spyWord : agentWord,
      isAlive: true
    };
  });

  const startIndex = Math.floor(Math.random() * players.length);
  const viewingOrder: string[] = [];
  for (let i = 0; i < players.length; i += 1) {
    viewingOrder.push(players[(startIndex + i) % players.length].id);
  }

  return {
    ...state,
    players,
    agentWord,
    spyWord,
    viewingOrder,
    viewingIndex: 0,
    phase: 'roleViewing'
  };
}

function evaluateWinner(state: UndercoverState): UndercoverState['winner'] {
  const alive = state.players.filter((p) => p.isAlive);
  const aliveMrWhite = alive.filter((p) => p.role === 'MrWhite').length;
  const aliveSpy = alive.filter((p) => p.role === 'Spy').length;
  const aliveAgent = alive.filter((p) => p.role === 'Agent').length;
  const totalAlive = alive.length;

  if (aliveMrWhite === 0 && aliveSpy === 0) return 'Agents';

  if (aliveMrWhite === 0 && totalAlive >= 2 && totalAlive <= 3 && aliveSpy >= 1) {
    return 'Spy';
  }

  if (aliveMrWhite > 0 && aliveAgent === 0 && aliveSpy === 0) {
    return 'MrWhite';
  }

  return null;
}

function reducer(state: UndercoverState, action: Action): UndercoverState {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'setTotal':
      return { ...state, totalPlayers: action.total };
    case 'setNames':
      return { ...state, names: action.names };
    case 'setMrWhite':
      return { ...state, mrWhiteCount: action.count };
    case 'setSpy':
      return { ...state, spyCount: action.count };
    case 'startGame':
      return assignRoles(state);
    case 'nextViewer': {
      const nextIndex = state.viewingIndex + 1;
      if (nextIndex >= state.viewingOrder.length) {
        return { ...state, viewingIndex: nextIndex, phase: 'gameStart' };
      }
      return { ...state, viewingIndex: nextIndex };
    }
    case 'startPlay':
      return { ...state, phase: 'gameStart' };
    case 'goElimination':
      return { ...state, phase: 'elimination' };
    case 'eliminate': {
      const players = state.players.map((p) =>
        p.id === action.playerId ? { ...p, isAlive: false } : p
      );
      const winner = evaluateWinner({ ...state, players });
      return {
        ...state,
        players,
        eliminatedPlayerId: action.playerId,
        phase: winner ? 'winner' : 'roleReveal',
        winner: winner ?? null
      };
    }
    case 'revealDone':
      if (action.winner) {
        return { ...state, winner: action.winner, phase: 'winner' };
      }
      return { ...state, phase: 'gameStart', eliminatedPlayerId: null };
    case 'mrWhiteGuess':
      return {
        ...state,
        winner: action.correct ? 'MrWhite' : 'Agents',
        phase: 'winner'
      };
    default:
      return state;
  }
}

type UndercoverContextValue = {
  state: UndercoverState;
  dispatch: (action: Action) => void;
};

const UndercoverContext = createContext<UndercoverContextValue | undefined>(undefined);

export function UndercoverProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (base) => {
    if (typeof window === 'undefined') return base;
    try {
      const raw = window.localStorage.getItem(LOCAL_KEY);
      if (!raw) return base;
      return { ...base, ...(JSON.parse(raw) as Partial<UndercoverState>) };
    } catch {
      return base;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      dispatch
    }),
    [state]
  );

  return <UndercoverContext.Provider value={value}>{children}</UndercoverContext.Provider>;
}

export function useUndercover() {
  const ctx = useContext(UndercoverContext);
  if (!ctx) {
    throw new Error('useUndercover must be used within UndercoverProvider');
  }
  return ctx;
}

