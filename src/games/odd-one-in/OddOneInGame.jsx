import { Routes, Route } from 'react-router-dom'
import GameSelection from './screens/GameSelection'
import CreateRoom from './screens/CreateRoom'
import JoinRoom from './screens/JoinRoom'
import Lobby from './screens/Lobby'
import QuestionRound from './screens/QuestionRound'
import AnswerReview from './screens/AnswerReview'
import Winner from './screens/Winner'
import './oddOneInTheme.css'

export default function OddOneInGame() {
  return (
    <div className="odd-one-in-app">
      <Routes>
        <Route index element={<GameSelection />} />
        <Route path="index" element={<GameSelection />} />
        <Route path="create" element={<CreateRoom />} />
        <Route path="join" element={<JoinRoom />} />
        <Route path="room/:code" element={<Lobby />} />
        <Route path="game/:code" element={<QuestionRound />} />
        <Route path="review/:code" element={<AnswerReview />} />
        <Route path="winner/:code" element={<Winner />} />
      </Routes>
    </div>
  )
}
