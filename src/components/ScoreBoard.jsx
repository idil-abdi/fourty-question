function ScoreBoard({ scores, currentPlayer, message }) {
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 items-center">
            {/* Player 1 */}
            <div className={`text-center p-4 rounded-lg transition-all ${currentPlayer === 1 ? 'bg-blue-500/30 ring-2 ring-blue-400' : 'bg-white/5'}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-white">Player 1</span>
                </div>
                <div className="text-4xl font-bold text-blue-400">
                    {scores.player1}
                </div>
            </div>
            
            {/* Message */}
            <div className="text-center">
                <div className="text-white text-lg font-semibold">
                    {message}
                </div>
            </div>
            
            {/* Player 2 */}
            <div className={`text-center p-4 rounded-lg transition-all ${currentPlayer === 2 ? 'bg-red-500/30 ring-2 ring-red-400' : 'bg-white/5'}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-white">Player 2</span>
                </div>
                <div className="text-4xl font-bold text-red-400">
                    {scores.player2}
                </div>
            </div>
        </div>
        </div>
    )
}

export default ScoreBoard