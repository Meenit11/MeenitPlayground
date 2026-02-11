import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { useOddRoom } from '../context/OddRoomContext';

export function JoinRoomScreen() {
  const { joinExistingRoom, loading, error } = useOddRoom();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCode = code.trim();
    if (trimmedName.length < 2 || trimmedCode.length !== 4) return;
    await joinExistingRoom(trimmedCode, trimmedName);
    navigate(`/odd-one-in/room/${trimmedCode}/lobby`);
  };

  return (
    <div className="theme-odd odd-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Join Room</h2>
          <p className="home-tagline">Enter the 4-digit code from your Game Master.</p>
        </header>
        <form className="home-section" onSubmit={onSubmit}>
          <label className="form-label">
            Room code
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              className="input"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="1234"
              required
            />
          </label>
          <label className="form-label">
            Your name
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Player name"
              minLength={2}
              required
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button
            className="btn-primary"
            type="submit"
            disabled={loading || name.trim().length < 2 || code.trim().length !== 4}
          >
            {loading ? 'Joining…' : 'Join Room'}
          </button>
        </form>
      </PageContainer>
    </div>
  );
}

