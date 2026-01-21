// src/App.jsx
import { useState, useEffect, useRef,  } from 'react';
import GameHeader from './components/GameHeader';
import ScoreBoard from './components/ScoreBoard';
import GameBoard from './components/GameBoard';
import QuestionModal from './components/QuestionModal';
import EndGameScreen from './components/EndGameScreen';
import { RefreshCw } from 'lucide-react';
import { fetchQuestions } from './utils/apiService'; // ← NEW IMPORT
import { calculateScores, validateAnswer, isGameOver, getWinner } from './utils/gameLogic';

function App() {
  
  // ===== STATE =====
  const [gameState, setGameState] = useState('loading'); // ← Changed from 'setup' to 'loading'
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [selectedBox, setSelectedBox] = useState(null);
  const [grid, setGrid] = useState([]);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [message, setMessage] = useState('Loading questions...');
  const [answer, setAnswer] = useState('');
  const [questions, setQuestions] = useState([]); // ← NEW STATE for storing questions

  // ===== INITIALIZE GAME ON MOUNT =====
  /**
   * Fetch questions and initialize game when app first loads
   * Runs ONCE when component mounts
   */
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return; // Prevent double initialization
    hasInitialized.current = true;
    initializeGame();
  }); // Empty array = run once

  /**
   * Initialize a new game
   * 
   * STEPS:
   * 1. Set loading state
   * 2. Fetch questions from API
   * 3. Create grid from questions
   * 4. Pick random first player
   * 5. Start game
   */
  const initializeGame = async () => {
    // console.log('🎮 Initializing game...');
    
    // Show loading state
    setGameState('loading');
    setMessage('Loading questions from OpenTDB...');
    
    // Fetch questions from API (async operation)
    const fetchedQuestions = await fetchQuestions();
    setQuestions(fetchedQuestions);
    // console.log(questions);
    

    // Create grid from questions
    const newGrid = fetchedQuestions.map((q, idx) => ({
      id: idx,
      question: q.q,
      answer: q.a,
      initials: q.i,
      claimed: null,
      attempted: false
    }));
    
    setGrid(newGrid);
    // console.log('✅ Grid created with', newGrid.length, 'boxes');
    
    // Random first player
    const firstPlayer = Math.random() < 0.5 ? 1 : 2;
    setCurrentPlayer(firstPlayer);
    // console.log('🎲 Player', firstPlayer, 'goes first');
    
    // Set initial message
    setMessage(`Player ${firstPlayer} goes first!`);
    
    // Start game
    setGameState('playing');
    // console.log('▶️ Game started!');
  };
  

  // ===== EVENT HANDLERS =====
  // (All the same as before - handleBoxClick, handleSubmitAnswer, etc.)
  
  const handleBoxClick = (box) => {
    // console.log('Box clicked:', box.id + 1, box.initials);


    if (gameState !== 'playing' && gameState !== 'tiebreaker') {
      // console.log('Ignoring click - wrong game state:', gameState);
      return;
    }
    
    if (box.claimed) {
      // console.log('Ignoring click - box already claimed by player', box.claimed);
      return;
    }
    
    setSelectedBox(box);
    setGameState('question');
    setAnswer('');
    setMessage('');
    
    // console.log('Question modal opened for box', box.id + 1);
  };

  const handleSubmitAnswer = () => {
    // console.log('Submit clicked, answer:', answer);

    
    if (!answer.trim()) {
      setMessage('Please enter an answer!');
      // console.log('Validation failed: empty answer');
      return;
    }
    
    const correct = validateAnswer(answer, selectedBox.answer);
    // console.log('Answer correct?', correct);
    // console.log('User answered:', answer);
    // console.log('Correct answer:', selectedBox.answer);
    
    const updatedGrid = grid.map(box => 
      box.id === selectedBox.id 
        ? { ...box, claimed: correct ? currentPlayer : null, attempted: true }
        : box
    );
    
    setGrid(updatedGrid);
    // console.log('Grid updated, box', selectedBox.id + 1, 'claimed by player', correct ? currentPlayer : 'none');

    if (correct) {
      setMessage(`✅ Correct! Player ${currentPlayer} claims the box!`);
      
      const newScores = calculateScores(updatedGrid);
      setScores(newScores);
      // console.log('New scores:', newScores);
      
      setTimeout(() => {
        handleGameProgress(updatedGrid, newScores);
      }, 1500);
      
    } else {
      setMessage(`❌ Incorrect `);
      
      setTimeout(() => {
        switchPlayer();
      }, 2500);
    }
  };

  const handleGameProgress = (updatedGrid, newScores) => {
    // console.log('Checking game progress...');
    
    const gameOver = isGameOver(updatedGrid);
    // console.log('Game over?', gameOver);
    
    if (gameOver) {
      endGame(newScores);
    } else {
      switchPlayer();
    }
  };

  const switchPlayer = () => {
    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    // console.log('Switching from player', currentPlayer, 'to player', nextPlayer);
    
    setCurrentPlayer(nextPlayer);
    setGameState('playing');
    setSelectedBox(null);
    setMessage(`Player ${nextPlayer}'s turn`);
  };

  const endGame = (finalScores) => {
    // console.log('Game ended! Final scores:', finalScores);
    
    const winner = getWinner(finalScores);
    // console.log('Winner:', winner);
    
    setGameState('ended');
    
    if (winner === 'player1') {
      setMessage('🎉 Player 1 Wins!');
    } else if (winner === 'player2') {
      setMessage('🎉 Player 2 Wins!');
    } else {
      setMessage('🤝 Draw!');
    }
  };

  /**
   * Reset game - Fetch NEW questions and start fresh
   * Called when "Play Again" button is clicked
   */
  const resetGame = () => {
    // console.log('🔄 Resetting game...');
    initializeGame(); // Fetches new questions!
  };

  // ===== RENDER =====
  
  // Loading screen while fetching questions
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex items-center justify-center">
        <div className="text-center">
          {/* Loading animation */}
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Loading Questions...
          </h2>
          <p className="text-purple-200 mb-4">
            Fetching trivia from OpenTDB
          </p>
          {/* Spinner */}
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto">
        
        <GameHeader />
        
        <ScoreBoard 
          scores={scores}
          currentPlayer={currentPlayer}
          message={message}
        />
        
        {(gameState === 'playing' || gameState === 'tiebreaker' || gameState === 'ended') && grid.length > 0 && (
          <GameBoard 
            grid={grid}
            onBoxClick={handleBoxClick}
            gameState={gameState}
          />
        )}
        
        {gameState === 'question' && (
          <QuestionModal 
            selectedBox={selectedBox}
            answer={answer}
            onAnswerChange={setAnswer}
            onSubmit={handleSubmitAnswer}
            message={message}
          />
        )}
        
        {gameState === 'ended' && (
          <EndGameScreen 
            winner={getWinner(scores)}
            scores={scores}
            onReset={resetGame}
          />
        )}
        
      </div>
    </div>
  );
}

export default App;

// ===== UNDERSTANDING THE FLOW WITH API =====
//
// APP LOADS:
// 1. Component mounts
// 2. useState('loading') → gameState = 'loading'
// 3. useEffect([]) runs → initializeGame()
// 4. initializeGame() is async function
// 5. await fetchQuestions() → makes HTTP request
// 6. WAIT for API response (1-2 seconds)
// 7. API returns 40 questions
// 8. Create grid from questions
// 9. setGameState('playing')
// 10. Loading screen disappears, game board appears
//
// PLAY AGAIN:
// 1. User clicks "Play Again" button
// 2. resetGame() called
// 3. resetGame() calls initializeGame()
// 4. initializeGame() fetches NEW 40 questions
// 5. Different questions this time!
// 6. Game restarts with fresh questions