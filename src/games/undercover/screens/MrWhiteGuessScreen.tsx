import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/PageContainer';
import { useUndercover } from '../context/UndercoverContext';

export function MrWhiteGuessScreen() {
  const { state, dispatch } = useUndercover();
  const navigate = useNavigate();
  const [guess, setGuess] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = guess.trim().toLowerCase();
    const correct = trimmed === state.agentWord.toLowerCase();
    dispatch({ type: 'mrWhiteGuess', correct });
    navigate('/undercover/winner');
  };

  return (
    <div className="theme-undercover under-shell">
      <PageContainer>
        <header className="home-header">
          <h2 className="section-title">Mr. White&apos;s Last Chance</h2>
          <p className="home-tagline">Pass the phone to Mr. White.</p>
          <p className="home-tagline">Guess the Agents&apos; word to steal the win.</p>
        </header>

        <section className="home-section">
          <form onSubmit={onSubmit}>
            <label className="form-label">
              Your guess
              <input
                type="text"
                className="input"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Type the Agents' word"
                required
              />
            </label>
            <button className="btn-primary" type="submit">
              Submit Guess
            </button>
          </form>
        </section>
      </PageContainer>
    </div>
  );
}

