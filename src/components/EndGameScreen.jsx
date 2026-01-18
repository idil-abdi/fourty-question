import { RefreshCw, Trophy } from 'lucide-react';

function EndGameScreen({ winner, scores, onReset }) {
    const getMessage = () => {
        if (winner === 'player1') return '🎉 Player 1 Wins!';
        if (winner === 'player2') return '🎉 Player 2 Wins!';
        return '🤝 It\'s a Draw!';
    }

    const getWinnerColor = () => {
        if (winner === 'player1') return 'text-blue-400';
        if (winner === 'player2') return 'text-red-400';
        return 'text-purple-400'; // Draw = purple (neutral)
    };

    return (
        <div className="text-center mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-6">
        
        {/* TROPHY ICON */}
            <div className="flex justify-center mb-4">
            <Trophy 
                className={`${getWinnerColor()}`} 
                size={80} 
            />
            </div>
        
        {/* WINNER MESSAGE */}
        <h2 className={`text-5xl font-bold mb-6 ${getWinnerColor()}`}>
          {getMessage()}
        </h2>
        
        {/* FINAL SCORES */}
        <div className="flex justify-center gap-12 text-3xl font-bold">
          {/* Player 1 Score */}
          <div className="text-center">
            <div className="text-white/60 text-lg mb-2">Player 1</div>
            <div className={`text-5xl ${winner === 'player1' ? 'text-blue-400' : 'text-white/40'}`}>
              {scores.player1}
            </div>
          </div>
          
          {/* VS Separator */}
          <div className="flex items-center text-white/40">
            VS
          </div>
          
          {/* Player 2 Score */}
          <div className="text-center">
            <div className="text-white/60 text-lg mb-2">Player 2</div>
            <div className={`text-5xl ${winner === 'player2' ? 'text-red-400' : 'text-white/40'}`}>
              {scores.player2}
            </div>
          </div>
        </div>
        
      </div>
      
      {/* PLAY AGAIN BUTTON */}
      <button
        onClick={onReset}
        className="bg-linear-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl flex items-center gap-3 mx-auto transition-all hover:scale-105 shadow-lg"
      >
        <RefreshCw size={24} />
        Play Again
      </button>
      
    </div>
    )
}

export default EndGameScreen