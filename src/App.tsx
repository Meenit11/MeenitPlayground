import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { OddOneInGame } from './games/odd-one-in/OddOneInGame';
import { UndercoverGame } from './games/undercover/UndercoverGame';
import { MafiaGame } from './games/mafia/MafiaGame';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/odd-one-in/*" element={<OddOneInGame />} />
      <Route path="/undercover/*" element={<UndercoverGame />} />
      <Route path="/mafia/*" element={<MafiaGame />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

