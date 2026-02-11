import { Routes, Route, Navigate } from 'react-router-dom';
import { PageContainer } from '../../shared/PageContainer';
import './mafiaTheme.css';
import { MafiaProvider } from './context/MafiaContext';
import { MafiaSetupScreen } from './screens/SetupScreen';
import { MafiaRoleViewingScreen } from './screens/RoleViewingScreen';
import { MafiaGameMasterOverviewScreen } from './screens/GameMasterOverviewScreen';
import { MafiaNightPhaseScreen } from './screens/NightPhaseScreen';
import { MafiaMorningResultsScreen } from './screens/MorningResultsScreen';
import { MafiaDayPhaseScreen } from './screens/DayPhaseScreen';
import { MafiaWinnerScreen } from './screens/WinnerScreen';

function MafiaLanding() {
  return (
    <div className="theme-mafia mafia-shell">
      <PageContainer>
        <header className="home-header">
          <img src="/images/Mafia Logo.png" alt="Mafia" className="home-logo" />
          <p className="home-tagline">Family dinners, but with voting.</p>
        </header>
        <MafiaSetupScreen />
      </PageContainer>
    </div>
  );
}

export function MafiaGame() {
  return (
    <MafiaProvider>
      <Routes>
        <Route path="/" element={<MafiaLanding />} />
        <Route path="roles" element={<MafiaRoleViewingScreen />} />
        <Route path="overview" element={<MafiaGameMasterOverviewScreen />} />
        <Route path="night" element={<MafiaNightPhaseScreen />} />
        <Route path="morning" element={<MafiaMorningResultsScreen />} />
        <Route path="day" element={<MafiaDayPhaseScreen />} />
        <Route path="winner" element={<MafiaWinnerScreen />} />
        <Route path="*" element={<Navigate to=".." replace />} />
      </Routes>
    </MafiaProvider>
  );
}

