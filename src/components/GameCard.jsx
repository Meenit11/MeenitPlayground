import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export function GameCard({ to, logo, title, description, genre, players, tagline, theme }) {
  return (
    <motion.div
      className={`game-card game-card--${theme}`}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={to} className="game-card__link">
        <div className="game-card__logo-wrap">
          <img src={logo} alt={title} className="game-card__logo" />
        </div>
        <h3 className="game-card__title">{title}</h3>
        <p className="game-card__tagline">{tagline}</p>
        <p className="game-card__description">{description}</p>
        <div className="game-card__meta">
          <span className="game-card__genre">{genre}</span>
          <span className="game-card__players">👥 {players}</span>
        </div>
        <span className="game-card__play-btn">Play</span>
      </Link>
    </motion.div>
  )
}
