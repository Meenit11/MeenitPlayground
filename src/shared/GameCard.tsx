import { Link } from 'react-router-dom';

type GameCardProps = {
  theme: 'odd' | 'undercover' | 'mafia';
  logoSrc: string;
  title: string;
  tagline: string;
  description: string;
  genre: string;
  players: string;
  to: string;
};

export function GameCard({
  theme,
  logoSrc,
  title,
  tagline,
  description,
  genre,
  players,
  to
}: GameCardProps) {
  return (
    <article className={`game-card game-card-${theme}`}>
      <div className="game-card-header">
        <img src={logoSrc} alt={title} className="game-card-logo" />
        <div>
          <h3 className="game-card-title">{title}</h3>
          <p className="game-card-tagline">{tagline}</p>
        </div>
      </div>
      <p className="game-card-description">{description}</p>
      <div className="game-card-meta">
        <span className="badge">{genre}</span>
        <span className="badge badge-soft">{players}</span>
      </div>
      <Link to={to} className="btn-primary game-card-button">
        Play
      </Link>
    </article>
  );
}

