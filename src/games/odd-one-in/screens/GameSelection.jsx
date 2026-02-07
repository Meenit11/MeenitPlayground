import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function GameSelection() {
  return (
    <div className="screen odd-selection">
      <Link to="/" className="back-btn">← Back</Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="odd-selection__content"
      >
        <img src="/images/Odd One In Logo.png" alt="Odd One In" className="logo-small" />
        <p className="tagline">Be Weird or Be Gone! Matching is for socks, not survivors!</p>
        <div className="odd-selection__buttons">
          <Link to="/odd-one-in/create" className="odd-selection__btn btn-primary">Create Room</Link>
          <Link to="/odd-one-in/join" className="odd-selection__btn btn-secondary" style={{ marginTop: 12, display: 'block' }}>Join Room</Link>
          <Link to="/" className="btn-secondary" style={{ marginTop: 16, display: 'block' }}>Back to Home</Link>
        </div>
      </motion.div>
    </div>
  )
}
