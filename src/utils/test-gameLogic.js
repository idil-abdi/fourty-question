import { calculateScores, validateAnswer, isGameOver, getWinner } from './gameLogic';

console.log('===== TESTING GAME LOGIC =====');

// ===== TEST 1: validateAnswer =====
console.log('\n--- Test validateAnswer ---');
console.log('Paris = Paris:', validateAnswer('Paris', 'Paris')); // Should be true
console.log('paris = Paris:', validateAnswer('paris', 'Paris')); // Should be true
console.log('  Paris  = Paris:', validateAnswer('  Paris  ', 'Paris')); // Should be true
console.log('London = Paris:', validateAnswer('London', 'Paris'));

// ===== TEST 2: calculateScores =====
console.log('\n--- Test calculateScores ---');

// Create fake grid with 40 boxes
const testGrid = Array(40).fill(null).map((_, i) => ({
  id: i,
  claimed: null // Start with all unclaimed
}));

// Test horizontal: Player 1 owns boxes 0, 1, 2, 3 (first row)
testGrid[0].claimed = 1;
testGrid[1].claimed = 1;
testGrid[2].claimed = 1;
testGrid[3].claimed = 1;

let scores = calculateScores(testGrid);
console.log('Horizontal 4-in-row for P1:', scores);
// EXPECTED: { player1: 1, player2: 0 }

// Test vertical: Player 2 owns boxes 0, 8, 16, 24 (first column)
testGrid[0].claimed = 2;
testGrid[8].claimed = 2;
testGrid[16].claimed = 2;
testGrid[24].claimed = 2;

scores = calculateScores(testGrid);
console.log('Vertical 4-in-row for P2:', scores);
// EXPECTED: { player1: 0, player2: 1 } (horizontal was overwritten)

// ===== TEST 3: isGameOver =====
console.log('\n--- Test isGameOver ---');
console.log('All unclaimed:', isGameOver(testGrid)); // Should be false

// Claim all boxes
testGrid.forEach(box => box.claimed = 1);
console.log('All claimed:', isGameOver(testGrid)); // Should be true

// ===== TEST 4: getWinner =====
console.log('\n--- Test getWinner ---');
console.log('P1 wins:', getWinner({ player1: 5, player2: 3 })); // Should be 'player1'
console.log('P2 wins:', getWinner({ player1: 2, player2: 4 })); // Should be 'player2'
console.log('Draw:', getWinner({ player1: 3, player2: 3 })); // Should be 'draw'

console.log('\n===== ALL TESTS COMPLETE =====');