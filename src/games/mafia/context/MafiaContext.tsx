import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react';

export type MafiaRole =
  | 'Doctor'
  | 'Mafia'
  | 'Detective'
  | 'Jester'
  | 'Bomber'
  | 'Lover'
  | 'Civilian';

export type MafiaPlayer = {
  id: string;
  name: string;
  role: MafiaRole;
  isAlive: boolean;
};

export type MafiaPhase =
  | 'setup'
  | 'roleViewing'
  | 'gameMasterOverview'
  | 'night'
  | 'morningResults'
  | 'day'
  | 'winner';

export type MafiaWinner = 'Civilians' | 'Mafia' | 'Jester' | null;

export type MafiaState = {
  phase: MafiaPhase;
  round: number;
  players: MafiaPlayer[];
  totalPlayers: number;
  playerNames: string[];
  gameMasterName: string;
  mafiaCount: number;
  detectiveEnabled: boolean;
  jesterEnabled: boolean;
  bomberEnabled: boolean;
  loverEnabled: boolean;
  loverTargetId: string | null;
  mafiaTargetId: string | null;
  doctorSaveId: string | null;
  nightDeathIds: string[];
  eliminatedTodayId: string | null;
  winner: MafiaWinner;
};

type Action =
  | { type: 'reset' }
  | { type: 'setTotal'; total: number }
  | { type: 'setPlayerNames'; names: string[] }
  | { type: 'setGameMasterName'; name: string }
  | { type: 'setMafiaCount'; count: number }
  | { type: 'toggleDetective' }
  | { type: 'toggleJester' }
  | { type: 'toggleBomber' }
  | { type: 'toggleLover' }
  | { type: 'startGame' }
  | { type: 'setLoverTarget'; playerId: string }
  | { type: 'setNightOutcome'; deathIds: string[] }
  | { type: 'gotoDay' }
  | { type: 'eliminateDay'; playerId: string; cause: 'vote' }
  | { type: 'setWinner'; winner: MafiaWinner };

const LOCAL_KEY = 'mafia-state-v1';

const initialState: MafiaState = {
  phase: 'setup',
  round: 1,
  players: [],
  totalPlayers: 5,
  playerNames: [],
  gameMasterName: '',
  mafiaCount: 1,
  detectiveEnabled: false,
  jesterEnabled: false,
  bomberEnabled: false,
  loverEnabled: false,
  loverTargetId: null,
  mafiaTargetId: null,
  doctorSaveId: null,
  nightDeathIds: [],
  eliminatedTodayId: null,
  winner: null
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildRoles(state: MafiaState): MafiaRole[] {
  const roles: MafiaRole[] = ['Doctor'];
  for (let i = 0; i < state.mafiaCount; i += 1) roles.push('Mafia');
  if (state.detectiveEnabled) roles.push('Detective');
  if (state.jesterEnabled) roles.push('Jester');
  if (state.bomberEnabled) roles.push('Bomber');
  if (state.loverEnabled) roles.push('Lover');
  const specialsCount = roles.length;
  const civiliansCount = state.totalPlayers - specialsCount;
  for (let i = 0; i < civiliansCount; i += 1) roles.push('Civilian');
  return roles;
}

function assignMafiaRoles(state: MafiaState): MafiaState {
  const roles = shuffle(buildRoles(state));
  const players: MafiaPlayer[] = state.playerNames.map((name, idx) => ({
    id: `${Date.now()}-${idx}`,
    name,
    role: roles[idx],
    isAlive: true
  }));
  return {
    ...state,
    players,
    phase: 'roleViewing',
    round: 1,
    winner: null,
    nightDeathIds: [],
    eliminatedTodayId: null
  };
}

function evaluateWinner(state: MafiaState): MafiaWinner {
  const alive = state.players.filter((p) => p.isAlive);
  const aliveMafia = alive.filter((p) => p.role === 'Mafia').length;
  const aliveCivilians = alive.filter((p) => p.role !== 'Mafia').length;

  if (aliveMafia === 0) return 'Civilians';
  if (aliveMafia >= aliveCivilians) return 'Mafia';
  return null;
}

function reducer(state: MafiaState, action: Action): MafiaState {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'setTotal':
      return { ...state, totalPlayers: action.total };
    case 'setPlayerNames':
      return { ...state, playerNames: action.names };
    case 'setGameMasterName':
      return { ...state, gameMasterName: action.name };
    case 'setMafiaCount':
      return { ...state, mafiaCount: action.count };
    case 'toggleDetective':
      return { ...state, detectiveEnabled: !state.detectiveEnabled };
    case 'toggleJester':
      return { ...state, jesterEnabled: !state.jesterEnabled };
    case 'toggleBomber':
      return { ...state, bomberEnabled: !state.bomberEnabled };
    case 'toggleLover':
      return { ...state, loverEnabled: !state.loverEnabled };
    case 'startGame':
      return assignMafiaRoles(state);
    case 'setLoverTarget':
      return { ...state, loverTargetId: action.playerId };
    case 'setNightOutcome': {
      const players = state.players.map((p) =>
        action.deathIds.includes(p.id) ? { ...p, isAlive: false } : p
      );
      const winner = evaluateWinner({ ...state, players });
      return {
        ...state,
        players,
        nightDeathIds: action.deathIds,
        winner,
        phase: winner ? 'winner' : 'day'
      };
    }
    case 'gotoDay':
      return { ...state, phase: 'day', eliminatedTodayId: null };
    case 'eliminateDay': {
      const target = state.players.find((p) => p.id === action.playerId);
      if (!target) return state;

      if (target.role === 'Jester') {
        return {
          ...state,
          players: state.players.map((p) =>
            p.id === target.id ? { ...p, isAlive: false } : p
          ),
          eliminatedTodayId: target.id,
          winner: 'Jester',
          phase: 'winner'
        };
      }

      const players = state.players.map((p) =>
        p.id === action.playerId ? { ...p, isAlive: false } : p
      );
      const winner = evaluateWinner({ ...state, players });

      return {
        ...state,
        players,
        eliminatedTodayId: action.playerId,
        winner,
        phase: winner ? 'winner' : 'night',
        round: winner ? state.round : state.round + 1
      };
    }
    case 'setWinner':
      return { ...state, winner: action.winner, phase: 'winner' };
    default:
      return state;
  }
}

type MafiaContextValue = {
  state: MafiaState;
  dispatch: (action: Action) => void;
};

const MafiaContext = createContext<MafiaContextValue | undefined>(undefined);

export function MafiaProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (base) => {
    if (typeof window === 'undefined') return base;
    try {
      const raw = window.localStorage.getItem(LOCAL_KEY);
      if (!raw) return base;
      return { ...base, ...(JSON.parse(raw) as Partial<MafiaState>) };
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

  return <MafiaContext.Provider value={value}>{children}</MafiaContext.Provider>;
}

export function useMafia() {
  const ctx = useContext(MafiaContext);
  if (!ctx) {
    throw new Error('useMafia must be used within MafiaProvider');
  }
  return ctx;
}

