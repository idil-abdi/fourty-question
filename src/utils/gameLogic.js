/**
 * Calculate scores by detecting all four-in-a-row patterns
 * @param {Array} grid - Array of 40 box objects
 * @returns {Object} - { player1: number, player2: number }
 */

export const calculateScores = (grid) => {
    let p1Score = 0;
    let p2Score = 0;

  // Horizontal (5 rows × 5 starting positions)
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col <= 4; col++) {
            const indices = [
                row * 8 + col,
                row * 8 + col + 1,
                row * 8 + col + 2,
                row * 8 + col + 3
            ];
            const boxes = indices.map(i => grid[i]);
            if (boxes.every(b => b.claimed === 1)) p1Score++;
            if (boxes.every(b => b.claimed === 2)) p2Score++;
        }
    }

  // Vertical (2 starting rows × 8 columns)
    for (let col = 0; col < 8; col++) {
        for (let row = 0; row <= 1; row++) {
            const indices = [
                row * 8 + col,
                (row + 1) * 8 + col,
                (row + 2) * 8 + col,
                (row + 3) * 8 + col
            ];
            const boxes = indices.map(i => grid[i]);
            if (boxes.every(b => b.claimed === 1)) p1Score++;
            if (boxes.every(b => b.claimed === 2)) p2Score++;
        }
    }

  // Diagonal down-right
    for (let row = 0; row <= 1; row++) {
        for (let col = 0; col <= 4; col++) {
            const indices = [
                row * 8 + col,
                (row + 1) * 8 + col + 1,
                (row + 2) * 8 + col + 2,
                (row + 3) * 8 + col + 3
            ];
            const boxes = indices.map(i => grid[i]);
            if (boxes.every(b => b.claimed === 1)) p1Score++;
            if (boxes.every(b => b.claimed === 2)) p2Score++;
        }
    }

  // Diagonal down-left
    for (let row = 0; row <= 1; row++) {
        for (let col = 3; col < 8; col++) {
            const indices = [
                row * 8 + col,
                (row + 1) * 8 + col - 1,
                (row + 2) * 8 + col - 2,
                (row + 3) * 8 + col - 3
            ];
            const boxes = indices.map(i => grid[i]);
            if (boxes.every(b => b.claimed === 1)) p1Score++;
            if (boxes.every(b => b.claimed === 2)) p2Score++;
        }
    }

    return { player1: p1Score, player2: p2Score };
};

/**
 * Check if answer is correct (case-insensitive)
 * @param {string} userAnswer - Player's submitted answer
 * @param {string} correctAnswer - Correct answer from question data
 * @returns {boolean}
 */

export const validateAnswer = (userAnswer, correctAnswer) => {
    return userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
};

/**
 * Check if game has ended
 * @param {Array} grid - Current grid state
 * @returns {boolean}
 */
export const isGameOver = (grid) => {
    return grid.every(box => box.claimed !== null);
};

/**
 * Determine winner
 * @param {Object} scores - { player1: number, player2: number }
 * @returns {string} - 'player1', 'player2', or 'draw'
 */

export const getWinner = (scores) => {
    if (scores.player1 > scores.player2) return 'player1';
    if (scores.player2 > scores.player1) return 'player2';
    return 'draw';
};