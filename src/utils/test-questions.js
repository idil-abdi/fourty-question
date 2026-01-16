import {questions} from './questions'

console.log(`Total questions: `, questions.length);
console.log('First question:', questions[0]);

//  Test 3: Check all have letter-only initials
const hasNumbers = questions.some(q => /\d/.test(q.i));
console.log('Has numeric initials (should be false):', hasNumbers);