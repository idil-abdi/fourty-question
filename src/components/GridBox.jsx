
function GridBox({ box, onClick, disabled, isTiebreaker }) {
    const getBoxStyle = () => {
        if (box.claimed === 1) {
            return 'bg-blue-500 text-white';
        }

        if (box.claimed === 2) {
            return 'bg-red-500 text-white';
        }

        return 'bg-white/20 text-white hover:bg-white/30 hover:scale-105 cursor-pointer';
    };

    const getTiebreakerStyle = () => {
        return isTiebreaker && !box.claimed ? 'ring-2 ring-yellow-400 animate-pulse' : '';
    };

    return (
        <button
            onClick={() => onClick(box)}
            disabled={disabled || box.claimed}
            className={`aspect-square rounded-lg font-bold text-lg transition-all relative ${getBoxStyle()} ${getTiebreakerStyle()}`}
        >
            <span className="absolute top-0.5 left-1 text-xs opacity-60">
                {box.id + 1}
            </span>
            <span className="flex items-center justify-center h-full">
                {box.initials}
            </span>
    </button>
  );
}

export default GridBox