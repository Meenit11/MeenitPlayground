import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { useOddRoom } from '../context/OddRoomContext';

export function CreateRoomScreen() {
  const { createRoomWithName, loading, error } = useOddRoom();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) return;
    const code = await createRoomWithName(trimmed);
    navigate(`/odd-one-in/room/${code}/lobby`);
  };

  return (
    <div className="theme-odd odd-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Create Room</h2>
          <p className="home-tagline">Be the Game Master and host the chaos.</p>
        </header>
        <form className="home-section" onSubmit={onSubmit}>
          <label className="form-label">
            Your name
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Game Master name"
              minLength={2}
              required
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="btn-primary" type="submit" disabled={loading || name.trim().length < 2}>
            {loading ? 'Creating…' : 'Create Room'}
          </button>
        </form>
      </PageContainer>
    </div>
  );
}

