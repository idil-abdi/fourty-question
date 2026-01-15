// import { useState } from "react";
import GameHeader from "./components/GameHeader"
import ScoreBoard from "./components/ScoreBoard"

function App() {
  // const [scores, setScores] = useState({ player1: 0, player2: 0 });
  // const [message, setMessage] = useState('');
  // const [currentPlayer, setCurrentPlayer] = useState(1)

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto">
        <GameHeader/>
        <ScoreBoard/>
      </div>
    </div>
  )
}

export default App
