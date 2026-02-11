import { Routes, Route, Navigate } from 'react-router-dom';
import { PageContainer } from '../../shared/PageContainer';
import './undercoverTheme.css';
import { UndercoverProvider } from './context/UndercoverContext';
import { UndercoverSetupScreen } from './screens/SetupScreen';
import { RoleViewingScreen } from './screens/RoleViewingScreen';
import { UndercoverGameStartScreen } from './screens/GameStartScreen';
import { UndercoverEliminationScreen } from './screens/EliminationScreen';
import { UndercoverRoleRevealScreen } from './screens/RoleRevealScreen';
import { MrWhiteGuessScreen } from './screens/MrWhiteGuessScreen';
import { UndercoverWinnerScreen } from './screens/WinnerScreen';
import { UndercoverRules } from './UndercoverRules';

function UndercoverLanding() {
  return (
    <div className="theme-undercover under-shell">
      <PageContainer>
        <header className="home-header">
          <img
            src="/images/Undercover Logo.png"
            alt="Undercover"
            className="home-logo"
          />
          <p className="home-tagline">Trust no one… especially yourself.</p>
        </header>
        <section className="home-section">
          <UndercoverRules />
        </section>
        <section className="home-section">
          <UndercoverSetupScreen />
        </section>
      </PageContainer>
    </div>
  );
}

export function UndercoverGame() {
  return (
    <UndercoverProvider>
      <Routes>
        <Route path="/" element={<UndercoverLanding />} />
        <Route path="roles" element={<RoleViewingScreen />} />
        <Route path="play" element={<UndercoverGameStartScreen />} />
        <Route path="eliminate" element={<UndercoverEliminationScreen />} />
        <Route path="reveal" element={<UndercoverRoleRevealScreen />} />
        <Route path="mr-white-guess" element={<MrWhiteGuessScreen />} />
        <Route path="winner" element={<UndercoverWinnerScreen />} />
        <Route path="*" element={<Navigate to=".." replace />} />
      </Routes>
    </UndercoverProvider>
  );
}

