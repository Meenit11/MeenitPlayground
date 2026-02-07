import { Routes, Route } from 'react-router-dom'
import Setup from './screens/Setup'
import RoleViewing from './screens/RoleViewing'
import RoleDisplay from './screens/RoleDisplay'
import GameStart from './screens/GameStart'
import EliminationSelection from './screens/EliminationSelection'
import RoleReveal from './screens/RoleReveal'
import MrWhiteGuess from './screens/MrWhiteGuess'
import Winner from './screens/Winner'
import './undercoverTheme.css'

export default function UndercoverGame() {
  return (
    <div className="undercover-app">
      <Routes>
        <Route index element={<Setup />} />
        <Route path="role-view" element={<RoleViewing />} />
        <Route path="role-display" element={<RoleDisplay />} />
        <Route path="game" element={<GameStart />} />
        <Route path="eliminate" element={<EliminationSelection />} />
        <Route path="reveal" element={<RoleReveal />} />
        <Route path="guess" element={<MrWhiteGuess />} />
        <Route path="winner" element={<Winner />} />
      </Routes>
    </div>
  )
}
