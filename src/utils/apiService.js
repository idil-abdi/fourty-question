// src/utils/apiService.js


/**
 * API Service for fetching trivia questions from OpenTDB
 * 
 * WHAT IT DOES:
 * - Fetches 40 questions from OpenTDB API
 * - Decodes HTML entities (e.g., &quot; → ")
 * - Generates letter-only initials from answers
 * - Formats data for our game
 */

/**
 * Decode HTML entities in text
 * 
 * WHY: OpenTDB returns HTML-encoded text
 * EXAMPLES:
 * - "&quot;" → "
 * - "&#039;" → '
 * - "&amp;" → &
 * 
 * INPUT:  "What&#039;s the capital?"
 * OUTPUT: "What's the capital?"
 * 
 * @param {string} html - Text with HTML entities
 * @returns {string} - Decoded text
 */
const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

/**
 * Generate letter-only initials from answer text
 * 
 * RULES:
 * - Remove all non-letter characters
 * - Take first letter of each word
 * - If no letters, use first 3 chars of cleaned text
 * - Maximum 5 letters for readability
 * 
 * EXAMPLES:
 * "Paris" → "P"
 * "New York" → "NY"
 * "Leonardo da Vinci" → "LDV"
 * "1945" → "NFFF" (converts to "Nineteen Forty Five Four")
 * "H2O" → "HO" (removes numbers)
 * 
 * @param {string} text - Answer text
 * @returns {string} - Letter-only initials (uppercase)
 */
const generateInitials = (text) => {
  // Step 1: Decode HTML entities first
  const decoded = decodeHTML(text);
  
  // Step 2: Split into words
  const words = decoded.split(' ');
  
  // Step 3: Get first letter of each word (letters only)
  let initials = words
    .map(word => {
      // Remove non-letter characters and get first letter
      const letters = word.replace(/[^a-zA-Z]/g, '');
      return letters.charAt(0).toUpperCase();
    })
    .filter(letter => letter) // Remove empty strings
    .join('');
  
  // Step 4: If no letters found (e.g., "1945"), use first 3 letters
  if (initials.length === 0) {
    initials = decoded
      .replace(/[^a-zA-Z]/g, '') // Remove non-letters
      .substring(0, 3)            // Take first 3
      .toUpperCase();
  }
  
  // Step 5: Limit to 5 characters for readability
  if (initials.length > 5) {
    initials = initials.substring(0, 5);
  }
  
  // Step 6: If still empty, use 'Q' as fallback
  if (initials.length === 0) {
    initials = 'Q';
  }
  
  return initials;
};


/**
 * Fetch questions from OpenTDB API
 * 
 * API ENDPOINT:
 * https://opentdb.com/api.php?amount=40&category=9&difficulty=easy&type=multiple
 * 
 * RESPONSE FORMAT:
 * {
 *   response_code: 0,
 *   results: [
 *     {
 *       category: "General Knowledge",
 *       type: "multiple",
 *       difficulty: "easy",
 *       question: "What is the capital of France?",
 *       correct_answer: "Paris",
 *       incorrect_answers: ["London", "Berlin", "Madrid"]
 *     },
 *     ...
 *   ]
 * }
 * 
 * @returns {Promise<Array>} - Array of formatted question objects
*/
export const fetchQuestions = async () => {
   
    try {
    console.log('🌐 Fetching questions from OpenTDB API...');
    
    // Fetch 40 questions from General Knowledge category
    const response = await fetch(
      'https://opentdb.com/api.php?amount=40&category=9&difficulty=easy&type=multiple'
    );
    
    // Check if HTTP request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Parse JSON response
    const data = await response.json();
    
    console.log('✅ API Response received:', data);   
    
    // Check response code (0 = success, 1 = no results, 2 = invalid parameter)
    if (data.response_code !== 0) {
      throw new Error(`API error! response_code: ${data.response_code}`);
    }
    
    // Format questions for our game
    const formattedQuestions = data.results.map((item) => {
      const decodedQuestion = decodeHTML(item.question);
      const decodedAnswer = decodeHTML(item.correct_answer);
      const initials = generateInitials(decodedAnswer);
      
      return {
        q: decodedQuestion,   // Question text
        a: decodedAnswer,     // Correct answer
        i: initials           // Letter initials for grid box
      };
    });
    
    console.log('✅ Formatted', formattedQuestions.length, 'questions');
    console.log('📝 Sample initials:', formattedQuestions.slice(0, 40).map(q => `"${q.a}" → "${q.i}"`));
    
    return formattedQuestions;
    
  } catch (error) {
    console.error('❌ Error fetching questions:', error);
    
    // Return fallback questions if API fails
    console.warn('⚠️ Using fallback questions');
    return getFallbackQuestions();
  }
};

/**
 * Fallback questions if API fails
 * 
 * WHY: Network might be down, API might be unavailable
 * BETTER: Have backup questions than broken game
 * 
 * @returns {Array} - Array of fallback question objects
 */
const getFallbackQuestions = () => {
  return [
    { q: "What is the capital of France?", a: "Paris", i: "P" },
    { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci", i: "LDV" },
    { q: "What is the largest planet in our solar system?", a: "Jupiter", i: "J" },
    { q: "What year did World War II end?", a: "1945", i: "NFFF" },
    { q: "What is the chemical symbol for gold?", a: "Au", i: "AU" },
    { q: "Who wrote Romeo and Juliet?", a: "William Shakespeare", i: "WS" },
    { q: "What is the smallest country in the world?", a: "Vatican City", i: "VC" },
    { q: "What is the fastest land animal?", a: "Cheetah", i: "C" },
    { q: "How many continents are there?", a: "Seven", i: "S" },
    { q: "What is the tallest mountain in the world?", a: "Mount Everest", i: "ME" },
    { q: "What is the capital of Japan?", a: "Tokyo", i: "T" },
    { q: "Who invented the telephone?", a: "Alexander Graham Bell", i: "AGB" },
    { q: "What is the largest ocean on Earth?", a: "Pacific Ocean", i: "PO" },
    { q: "What year did man first land on the moon?", a: "1969", i: "NSNSS" },
    { q: "What is the chemical formula for water?", a: "H2O", i: "HTO" },
    { q: "Who painted The Starry Night?", a: "Vincent van Gogh", i: "VVG" },
    { q: "What is the smallest prime number?", a: "Two", i: "T" },
    { q: "What is the capital of Italy?", a: "Rome", i: "R" },
    { q: "How many bones are in the human body?", a: "Two hundred six", i: "THS" },
    { q: "What is the hardest natural substance on Earth?", a: "Diamond", i: "D" },
    { q: "Who discovered penicillin?", a: "Alexander Fleming", i: "AF" },
    { q: "What is the speed of light approximation?", a: "Three hundred million meters per second", i: "C" },
    { q: "What is the capital of Spain?", a: "Madrid", i: "M" },
    { q: "Who was the first President of the United States?", a: "George Washington", i: "GW" },
    { q: "What is the largest mammal in the world?", a: "Blue Whale", i: "BW" },
    { q: "What year did the Titanic sink?", a: "1912", i: "NSNT" },
    { q: "What is the national bird of the United States?", a: "Bald Eagle", i: "BE" },
    { q: "Who wrote Pride and Prejudice?", a: "Jane Austen", i: "JA" },
    { q: "What is the boiling point of water in Celsius?", a: "One hundred", i: "OH" },
    { q: "What is the capital of Germany?", a: "Berlin", i: "B" },
    { q: "Who composed the Four Seasons?", a: "Antonio Vivaldi", i: "AV" },
    { q: "What is the square root of one hundred forty-four?", a: "Twelve", i: "T" },
    { q: "What is the longest river in the world?", a: "Nile River", i: "NR" },
    { q: "Who invented the light bulb?", a: "Thomas Edison", i: "TE" },
    { q: "What is the capital of Australia?", a: "Canberra", i: "CA" },
    { q: "How many players are on a soccer team?", a: "Eleven", i: "E" },
    { q: "What is the freezing point of water in Fahrenheit?", a: "Thirty-two", i: "TT" },
    { q: "Who painted the Sistine Chapel ceiling?", a: "Michelangelo", i: "MI" },
    { q: "What is the chemical symbol for iron?", a: "Fe", i: "FE" },
    { q: "What is the capital of Canada?", a: "Ottawa", i: "O" }
  ];
};

// ===== UNDERSTANDING async/await =====
//
// WHAT: Modern JavaScript syntax for handling asynchronous operations
//
// OLD WAY (Promises with .then):
// fetch(url)
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error(error));
//
// NEW WAY (async/await):
// const response = await fetch(url);
// const data = await response.json();
// console.log(data);
//
// BENEFITS:
// - Looks like synchronous code (easier to read)
// - Better error handling with try/catch
// - Can use variables across multiple awaits
//
// EXAMPLE:
// async function getData() {
//   try {
//     const response = await fetch(url);  // Wait for fetch
//     const json = await response.json(); // Wait for parsing
//     return json;                         // Return data
//   } catch (error) {
//     console.error(error);                // Handle errors
//   }
// }

// ===== UNDERSTANDING HTML ENTITIES =====
//
// OpenTDB returns HTML-encoded text for safety
//
// EXAMPLES:
// "&quot;" → "
// "&#039;" → '
// "&amp;" → &
// "&lt;" → 
// "&gt;" → >
//
// FULL EXAMPLE:
// API returns: "What&#039;s the capital of France?"
// We decode to: "What's the capital of France?"
//
// HOW WE DECODE:
// 1. Create temporary textarea element
// 2. Set innerHTML (browser auto-decodes)
// 3. Read value (get decoded text)
// 4. Element is temporary, gets garbage collected