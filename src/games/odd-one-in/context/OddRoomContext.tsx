import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  createRoom,
  joinRoom,
  kickPlayer,
  closeRoom,
  OddRoomDoc,
  subscribeToRoom
} from '../services/oddBackend';

type OddRoomContextValue = {
  room: OddRoomDoc | null;
  loading: boolean;
  error: string | null;
  playerId: string | null;
  isGameMaster: boolean;
  /** True when room is loaded but current player is not in room.players (e.g. kicked). */
  isKicked: boolean;
  createRoomWithName: (name: string) => Promise<string>;
  joinExistingRoom: (code: string, name: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  kick: (playerId: string) => Promise<void>;
  close: () => Promise<void>;
};

const OddRoomContext = createContext<OddRoomContextValue | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const LOCAL_KEY = 'odd-one-in-player-id';

function getOrCreatePlayerId() {
  if (typeof window === 'undefined') return null;
  const existing = window.localStorage.getItem(LOCAL_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  window.localStorage.setItem(LOCAL_KEY, id);
  return id;
}

export function OddRoomProvider({ children }: Props) {
  const [room, setRoom] = useState<OddRoomDoc | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState<string | null>(null);
  const playerId = useMemo(() => getOrCreatePlayerId(), []);

  useEffect(() => {
    if (!currentCode) return;
    setLoading(true);
    const unsub = subscribeToRoom(currentCode, (next) => {
      setRoom(next);
      setLoading(false);
    });
    return () => unsub();
  }, [currentCode]);

  const createRoomWithName = useCallback(
    async (name: string) => {
      if (!playerId) throw new Error('Missing player id');
      setError(null);
      setLoading(true);
      try {
        const roomDoc = await createRoom(name, playerId);
        setCurrentCode(roomDoc.code);
        setRoom(roomDoc);
        return roomDoc.code;
      } catch (e: any) {
        setError(e.message ?? 'Failed to create room');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [playerId]
  );

  const joinExistingRoom = useCallback(
    async (code: string, name: string) => {
      if (!playerId) throw new Error('Missing player id');
      setError(null);
      setLoading(true);
      try {
        const updated = await joinRoom(code, name, playerId);
        setCurrentCode(code);
        setRoom(updated);
      } catch (e: any) {
        setError(e.message ?? 'Failed to join room');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [playerId]
  );

  const kickFn = useCallback(
    async (id: string) => {
      if (!room) return;
      await kickPlayer(room.code, id);
    },
    [room]
  );

  const closeFn = useCallback(async () => {
    if (!room) return;
    await closeRoom(room.code);
  }, [room]);

  const leaveRoomFn = useCallback(async () => {
    // Players simply navigate away; GM can explicitly close the room.
    setCurrentCode(null);
    setRoom(null);
  }, []);

  const isGameMaster = !!room && !!playerId && room.gameMasterId === playerId;
  const isKicked =
    !!room && !!playerId && !room.players.some((p) => p.id === playerId);

  const value: OddRoomContextValue = {
    room,
    loading,
    error,
    playerId,
    isGameMaster,
    isKicked,
    createRoomWithName,
    joinExistingRoom,
    leaveRoom: leaveRoomFn,
    kick: kickFn,
    close: closeFn
  };

  return <OddRoomContext.Provider value={value}>{children}</OddRoomContext.Provider>;
}

export function useOddRoom() {
  const ctx = useContext(OddRoomContext);
  if (!ctx) {
    throw new Error('useOddRoom must be used within OddRoomProvider');
  }
  return ctx;
}

