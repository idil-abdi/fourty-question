import GridBox from "./GridBox";


function GameBoard({ grid, onBoxClick, gameState }) {
    const isDisabled = gameState !== 'playing' && gameState !== 'tiebreaker';
    const isTiebreaker = gameState === 'tiebreaker';

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
            <div className="grid grid-cols-8 gap-2">
                {grid.map((box) => (
                    <GridBox
                        key={box.id}
                        box={box}
                        onClick={onBoxClick}
                        disabled={isDisabled}
                        isTiebreaker={isTiebreaker} />))}
            </div>
        </div>
    );
}

export default GameBoard

