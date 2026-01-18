import { useEffect, useState } from "react";
import GameHeader from "./components/GameHeader"
import ScoreBoard from "./components/ScoreBoard"
import GameBoard from "./components/GameBoard";
import QuestionModal from "./components/QuestionModal";
import { questions } from './utils/questions';
import { calculateScores, validateAnswer, isGameOver, getWinner } from './utils/gameLogic';
import EndGameScreen from "./components/EndGameScreen";

function App() {
  const [gameState, setGameState] = useState('setup');
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [selectedBox, setSelectedBox] = useState(null);
  const [grid, setGrid] = useState([]);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (gameState === 'setup') {
      initializeGame();
    }
  }, [gameState]);
  
  const initializeGame = () => {
    console.log('Initializing game...');

    const newGrid = questions.map((q, idx) => ({
      id: idx,              // 0-39
      question: q.q,        // Question text
      answer: q.a,          // Correct answer
      initials: q.i,        // Letter clue
      claimed: null,        // null = unclaimed, 1 = player1, 2 = player2
      attempted: false      // Has anyone tried this? (not used in current rules)
    }));
    
    setGrid(newGrid);
    console.log('Grid created with', newGrid.length, 'boxes');
    
    const firstPlayer = Math.random() < 0.5 ? 1 : 2;
    
    setCurrentPlayer(firstPlayer);
    console.log('Player', firstPlayer, 'goes first');

    setMessage(`Player ${firstPlayer} goes first!`);
    
    setGameState('playing');
    console.log('Game started!');
  };


  const handleBoxClick = (box) => {
    console.log('Box clicked:', box.id + 1, box.initials);
    
    if (gameState !== 'playing' && gameState !== 'tiebreaker') {
      console.log('Ignoring click - wrong game state:', gameState);
      return; // Stop here
    }
    
    if (box.claimed) {
      console.log('Ignoring click - box already claimed by player', box.claimed);
      return; // Stop here
    }
    
    // Open question modal
    setSelectedBox(box);
    setGameState('question');
    setAnswer('');  // Clear previous answer
    setMessage(''); // Clear previous message
    
    console.log('Question modal opened for box', box.id + 1);
  };

  const handleSubmitAnswer = () => {
    console.log('Submit clicked, answer:', answer);
    
    if (!answer.trim()) {
      setMessage('Please enter an answer!');
      console.log('Validation failed: empty answer');
      return; // Stop here, don't proceed
    }
    
    const correct = validateAnswer(answer, selectedBox.answer);
    
    console.log('Answer correct?', correct);
    console.log('User answered:', answer);
    console.log('Correct answer:', selectedBox.answer);
    
    const updatedGrid = grid.map(box => 
      box.id === selectedBox.id 
        ? { ...box, claimed: correct ? currentPlayer : null, attempted: true }
        : box
    );
    
    setGrid(updatedGrid);
    console.log('Grid updated, box', selectedBox.id + 1, 'claimed by player', correct ? currentPlayer : 'none');

    if (correct) {
      setMessage(`✅ Correct! Player ${currentPlayer} claims the box!`);
      const newScores = calculateScores(updatedGrid);
      
      setScores(newScores);
      console.log('New scores:', newScores);
      
      setTimeout(() => {
        handleGameProgress(updatedGrid, newScores);
      }, 1500);
      
    } else {
      setMessage(`❌ Incorrect! The answer was: ${selectedBox.answer}. This box remains available.`);
      
      // Wait 2.5 seconds to show correct answer
      setTimeout(() => {
        switchPlayer();
      }, 2500);
    }
  };

  const handleGameProgress = (updatedGrid, newScores) => {
    console.log('Checking game progress...'); 
    const gameOver = isGameOver(updatedGrid);
    
    console.log('Game over?', gameOver);
    
    if (gameOver) {
      endGame(newScores);
    } else {
      switchPlayer();
    }
  };

  const switchPlayer = () => {
    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    
    console.log('Switching from player', currentPlayer, 'to player', nextPlayer);
    
    setCurrentPlayer(nextPlayer);
    setGameState('playing');      // Close modal, back to board
    setSelectedBox(null);         // Clear selected box
    setMessage(`Player ${nextPlayer}'s turn`);
  };

  const endGame = (finalScores) => {
    console.log('Game ended! Final scores:', finalScores);
    
    const winner = getWinner(finalScores);
    
    console.log('Winner:', winner);
    
    setGameState('ended');
    
    // Set appropriate message based on winner
    if (winner === 'player1') {
      setMessage('🎉 Player 1 Wins!');
    } else if (winner === 'player2') {
      setMessage('🎉 Player 2 Wins!');
    } else {
      setMessage('🤝 Draw!');
    }
  };

  
  const resetGame = () => {
    console.log('Resetting game...');
    
    setGameState('setup');              // Triggers useEffect → initializeGame
    setScores({ player1: 0, player2: 0 });
    setSelectedBox(null);
    setMessage('');
    setAnswer('');
    
    console.log('Game reset complete');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER - Always visible */}
        <GameHeader />
        
        {/* SCOREBOARD - Always visible */}
        <ScoreBoard 
          scores={scores}
          currentPlayer={currentPlayer}
          message={message}
        />
        
        {/* GAME BOARD - Show during play and after game ends */}
        {(gameState === 'playing' || gameState === 'tiebreaker' || gameState === 'ended') && grid.length > 0 && (
          <GameBoard 
            grid={grid}
            onBoxClick={handleBoxClick}
            gameState={gameState}
          />
        )}
        
        {/* QUESTION MODAL - Show when answering */}
        {gameState === 'question' && (
          <QuestionModal 
            selectedBox={selectedBox}
            answer={answer}
            onAnswerChange={setAnswer}
            onSubmit={handleSubmitAnswer}
            message={message}
          />
        )}
        
        {/* END GAME SCREEN - Show when game finished */}
        {gameState === 'ended' && (
          <div className="text-center mt-8">
            <button
              onClick={resetGame}
              className="bg-linear-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl flex items-center gap-3 mx-auto transition-all hover:scale-105"
            >
              🔄 Play Again
            </button>
          </div>
        )}

        {/* END GAME SCREEN - Show when game finished */}
        {gameState === 'ended' && (
          <EndGameScreen 
            winner={getWinner(scores)}
            scores={scores}
            onReset={resetGame}
          />
        )}
        
      </div>
    </div>
  )
}

export default App
