import { Link } from 'react-router-dom'
import { GameCard } from '../components/GameCard'
import { motion } from 'framer-motion'
import './Home.css'

const GAMES = [
  {
    path: '/odd-one-in',
    logo: "/images/Odd One In Logo.png",
    title: 'Odd One In',
    description: 'Find the Unique Answer',
    genre: 'Word Game',
    players: '3-20 Players',
    tagline: "Be Weird or Be Gone! Matching is for socks, not survivors!",
    theme: 'odd-one-in',
  },
  {
    path: '/undercover',
    logo: "/images/Undercover Logo.png",
    title: 'Undercover',
    description: "One word can save you, one word can end you!",
    genre: 'Social Deduction',
    players: '4-10 Players',
    tagline: "Lie, guess, survive - one word changes everything!",
    theme: 'undercover',
  },
  {
    path: '/mafia',
    logo: "/images/Mafia Logo.png",
    title: 'Mafia',
    description: "Survive the night, eliminate the Mafia!",
    genre: 'Mystery',
    players: '5-15 Players + Game Master',
    tagline: "Trust no one. Not even yourself. Especially yourself.",
    theme: 'mafia',
  },
]

export default function Home() {
  return (
    <div className="home">
      <motion.header
        className="home__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <img
          src="/images/Meenit's Playground.png"
          alt="Meenit's Playground"
          className="home__logo"
        />
        <p className="home__tagline">
          Where normal is boring and chaos is king! 👑
        </p>
      </motion.header>

      <h2 className="home__subtitle">Choose Your Game</h2>

      <div className="home__games">
        {GAMES.map((game, i) => (
          <GameCard key={game.path} {...game} />
        ))}
      </div>

      <motion.footer
        className="home__footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>Made with chaos & laughter 🎮✨</p>
      </motion.footer>
    </div>
  )
}
