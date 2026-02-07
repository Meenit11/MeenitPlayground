import { Routes, Route } from 'react-router-dom'
import Setup from './screens/Setup'
import RoleViewing from './screens/RoleViewing'
import RoleDisplay from './screens/RoleDisplay'
import GameMasterOverview from './screens/GameMasterOverview'
import NightPhase from './screens/NightPhase'
import MorningResults from './screens/MorningResults'
import DayPhase from './screens/DayPhase'
import SpecialElimination from './screens/SpecialElimination'
import Winner from './screens/Winner'
import './mafiaTheme.css'

export default function MafiaGame() {
  return (
    <div className="mafia-app">
      <Routes>
        <Route index element={<Setup />} />
        <Route path="role-view" element={<RoleViewing />} />
        <Route path="role-display" element={<RoleDisplay />} />
        <Route path="gm-overview" element={<GameMasterOverview />} />
        <Route path="night" element={<NightPhase />} />
        <Route path="morning" element={<MorningResults />} />
        <Route path="day" element={<DayPhase />} />
        <Route path="special" element={<SpecialElimination />} />
        <Route path="winner" element={<Winner />} />
      </Routes>
    </div>
  )
}
