// src/utils/gameLogic.js

export const calculateScores = (grid) => {
  // We'll calculate separately for each player
    const p1Score = calculatePlayerScore(grid, 1);
    const p2Score = calculatePlayerScore(grid, 2);

    return { player1: p1Score, player2: p2Score };
};

const calculatePlayerScore = (grid, player) => {
    const allPatterns = findAllFourBoxPatterns(grid, player);  
    const scoringPatterns = selectNonOverlappingPatterns(allPatterns);
    return scoringPatterns.length;
};

const findAllFourBoxPatterns = (grid, player) => {
    const patterns = [];

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col <= 4; col++) { // col + 3 must be < 8
        const indices = [
            row * 8 + col,
            row * 8 + col + 1,
            row * 8 + col + 2,
            row * 8 + col + 3
        ];
        
        if (indices.every(i => grid[i]?.claimed === player)) {
            patterns.push(indices);
        }
        }
    }

    for (let col = 0; col < 8; col++) {
        for (let row = 0; row <= 1; row++) { // row + 3 must be < 5
        const indices = [
            row * 8 + col,
            (row + 1) * 8 + col,
            (row + 2) * 8 + col,
            (row + 3) * 8 + col
        ];
        
        if (indices.every(i => grid[i]?.claimed === player)) {
            patterns.push(indices);
        }
        }
    }

    for (let row = 0; row <= 1; row++) {
        for (let col = 0; col <= 4; col++) {
            const indices = [
                row * 8 + col,
                (row + 1) * 8 + col + 1,
                (row + 2) * 8 + col + 2,
                (row + 3) * 8 + col + 3
            ];
    
    if (indices.every(i => grid[i]?.claimed === player)) {
        patterns.push(indices);
    }}}

    for (let row = 0; row <= 1; row++) {
        for (let col = 3; col < 8; col++) {
        const indices = [
            row * 8 + col,
            (row + 1) * 8 + col - 1,
            (row + 2) * 8 + col - 2,
            (row + 3) * 8 + col - 3
        ];
        
        if (indices.every(i => grid[i]?.claimed === player)) {
            patterns.push(indices);
        }
        }
    }

    return patterns;
};

const selectNonOverlappingPatterns = (patterns) => {
    const selected = [];
    const usedBoxes = new Set(); 

    for (const pattern of patterns) {
        const hasOverlap = pattern.some(index => usedBoxes.has(index));
    
        if (!hasOverlap) {
        selected.push(pattern);
        pattern.forEach(index => usedBoxes.add(index));
        }
    }

    return selected;
};


export const validateAnswer = (userAnswer, correctAnswer) => {
    return userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
};

export const isGameOver = (grid) => {
    return grid.every(box => box.claimed !== null);
};

export const getWinner = (scores) => {
    if (scores.player1 > scores.player2) return 'player1';
    if (scores.player2 > scores.player1) return 'player2';
    return 'draw';
};
