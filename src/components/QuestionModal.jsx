
function QuestionModal({selectedBox, answer, onAnswerChange, onSubmit, message}) {
    if (!selectedBox) return null;

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSubmit();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">  
        <div className="bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
        
        {/* ===== HEADER ===== */}
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Question for {selectedBox.initials}
        </h2>
        
        {/* ===== QUESTION DISPLAY ===== */}
        <div className="bg-white/20 rounded-lg p-6 mb-6">
            <p className="text-xl text-white leading-relaxed">
                {selectedBox.question}
            </p>
        </div>
        
        {/* ===== FEEDBACK MESSAGE (CONDITIONAL) ===== */}
        {message && (
            <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 mb-4">
                <p className="text-yellow-100 text-center">{message}</p>
            </div>
        )}
        
        {/* ===== ANSWER INPUT (CONTROLLED) ===== */}
        <input
            type="text"
            onChange={(e) => onAnswerChange(e.target.value)}          
            value={answer}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer..."
            className="w-full p-4 rounded-lg text-lg mb-4 bg-white/90 text-gray-900 placeholder-gray-500"
            autoFocus
        />
        
        {/* ===== SUBMIT BUTTON ===== */}
        <button onClick={onSubmit} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors">
            Submit Answer
        </button>
        
        </div>
        </div>
)
}

export default QuestionModal