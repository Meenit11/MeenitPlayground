import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { PageContainer } from '../../shared/PageContainer';
import './oddOneInTheme.css';
import { OddRoomProvider } from './context/OddRoomContext';
import { CreateRoomScreen } from './screens/CreateRoomScreen';
import { JoinRoomScreen } from './screens/JoinRoomScreen';
import { LobbyScreen } from './screens/LobbyScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { AnswerReviewScreen } from './screens/AnswerReviewScreen';
import { WinnerScreen } from './screens/WinnerScreen';

function OddLanding() {
  return (
    <div className="theme-odd odd-shell">
      <PageContainer>
        <header className="home-header">
          <img
            src="/images/Odd One In Logo.png"
            alt="Odd One In"
            className="home-logo"
          />
          <p className="home-tagline">
            Be Weird or Be Gone! Matching is for socks, not survivors!
          </p>
        </header>
        <section className="home-section">
          <div className="home-game-list">
            <Link to="create" className="btn-primary">
              Create Room
            </Link>
            <Link to="join" className="btn-ghost">
              Join Room
            </Link>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}

export function OddOneInGame() {
  return (
    <OddRoomProvider>
      <Routes>
        <Route path="/" element={<OddLanding />} />
        <Route path="create" element={<CreateRoomScreen />} />
        <Route path="join" element={<JoinRoomScreen />} />
        <Route path="room/:code/lobby" element={<LobbyScreen />} />
        <Route path="room/:code/question" element={<QuestionScreen />} />
        <Route path="room/:code/review" element={<AnswerReviewScreen />} />
        <Route path="room/:code/winner" element={<WinnerScreen />} />
        <Route path="*" element={<Navigate to=".." replace />} />
      </Routes>
    </OddRoomProvider>
  );
}

