import { Link } from 'react-router-dom';
import { PageContainer } from '../shared/PageContainer';
import { GameCard } from '../shared/GameCard';

export function HomePage() {
  return (
    <div className="theme-home">
      <PageContainer>
        <header className="home-header">
          <img
            src="/images/Meenit's Playground.png"
            alt="Meenit's Playground"
            className="home-logo"
          />
          <p className="home-tagline">Where normal is boring and chaos is king!</p>
        </header>

        <section className="home-section">
          <h2 className="section-title">Choose Your Game</h2>
          <div className="home-game-list">
            <GameCard
              theme="odd"
              logoSrc="/images/Odd One In Logo.png"
              title="Odd One In"
              tagline="Be Weird or Be Gone! Matching is for socks, not survivors!"
              description="Answer fast, think weird, and avoid matching anyone else."
              genre="Word Game"
              players="3–20 players"
              to="/odd-one-in"
            />
            <GameCard
              theme="undercover"
              logoSrc="/images/Undercover Logo.png"
              title="Undercover"
              tagline="Trust no one… especially yourself."
              description="Agents, Spies, and Mr. White bluff their way through one secret word."
              genre="Social Deduction"
              players="4–10 players"
              to="/undercover"
            />
            <GameCard
              theme="mafia"
              logoSrc="/images/Mafia Logo.png"
              title="Mafia"
              tagline="Family dinners, but with voting."
              description="Classic night-and-day betrayal with wild special roles."
              genre="Mystery"
              players="5–15 players + Game Master"
              to="/mafia"
            />
          </div>
        </section>

        <section className="home-section home-how-to">
          <h2 className="section-title">How it works</h2>
          <p className="home-how-copy">
            Pick a game, gather your friends, and follow the on-screen narrator. All rules are built
            in – you just bring the chaos.
          </p>
          <Link to="/odd-one-in" className="btn-ghost">
            Jump into Odd One In
          </Link>
        </section>
      </PageContainer>
    </div>
  );
}

