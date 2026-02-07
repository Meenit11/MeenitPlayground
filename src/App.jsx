import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import OddOneIn from './games/odd-one-in/OddOneInGame'
import Undercover from './games/undercover/UndercoverGame'
import Mafia from './games/mafia/MafiaGame'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/odd-one-in/*" element={<OddOneIn />} />
      <Route path="/undercover/*" element={<Undercover />} />
      <Route path="/mafia/*" element={<Mafia />} />
    </Routes>
  )
}

export default App
