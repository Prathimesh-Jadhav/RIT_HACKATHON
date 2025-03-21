import React, { useState } from 'react';

const QuizComponent = ({ questions }) => {
  // Track answered state and selected options for each question
  const [answeredState, setAnsweredState] = useState(questions.map(() => ({
    isAnswered: false,
    selectedOption: null
  })));
  
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (questionIndex, option) => {
    if (answeredState[questionIndex].isAnswered) return;
    
    const newAnsweredState = [...answeredState];
    newAnsweredState[questionIndex] = {
      isAnswered: true,
      selectedOption: option
    };
    
    setAnsweredState(newAnsweredState);
    
    if (option === questions[questionIndex].answer) {
      setScore(score + 1);
    }
  };
  
  const submitQuiz = () => {
    // Check if all questions are answered
    const allAnswered = answeredState.every(state => state.isAnswered);
    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }
    
    setShowResults(true);
  };
  
  const restartQuiz = () => {
    setAnsweredState(questions.map(() => ({
      isAnswered: false,
      selectedOption: null
    })));
    setScore(0);
    setShowResults(false);
  };
  
  const getOptionClass = (questionIndex, option) => {
    if (!answeredState[questionIndex].isAnswered) return "bg-gray-800 hover:bg-gray-700 border-gray-600";
    if (option === questions[questionIndex].answer) return "bg-green-900 border-green-500";
    if (option === answeredState[questionIndex].selectedOption) return "bg-red-900 border-red-500";
    return "bg-gray-800 opacity-60 border-gray-600";
  };

  if (showResults) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-lg shadow-lg text-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6">Quiz Results</h2>
        <p className="text-xl text-center mb-6">
          Your score: <span className="font-bold text-blue-400">{score}</span> out of {questions.length}
        </p>
        
        <div className="space-y-6 mb-6">
          {questions.map((question, index) => (
            <div key={index} className="p-4 border border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2">
                {index + 1}. {question.question}
              </h3>
              <div className="flex items-center text-sm">
                <span className="mr-2">Your answer:</span>
                <span className={answeredState[index].selectedOption === question.answer ? "text-green-400" : "text-red-400"}>
                  {answeredState[index].selectedOption}: {question.options[answeredState[index].selectedOption]}
                </span>
              </div>
              {answeredState[index].selectedOption !== question.answer && (
                <div className="flex items-center text-sm mt-1">
                  <span className="mr-2">Correct answer:</span>
                  <span className="text-green-400">
                    {question.answer}: {question.options[question.answer]}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button 
            onClick={restartQuiz}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-lg shadow-lg text-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Quiz</h1>
        <span className="text-sm font-medium text-blue-400">
          {answeredState.filter(state => state.isAnswered).length} of {questions.length} answered
        </span>
      </div>
      
      <div className="space-y-8 mb-6">
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="border border-gray-700 rounded-lg p-4">
            <div className="mb-3">
              <h2 className="text-lg font-bold mb-2">
                {questionIndex + 1}. {question.question}
              </h2>
            </div>
            
            <div className="space-y-2">
              {Object.entries(question.options).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleOptionSelect(questionIndex, key)}
                  className={`w-full text-left px-4 py-2 border-2 rounded-md transition-colors ${getOptionClass(questionIndex, key)}`}
                  disabled={answeredState[questionIndex].isAnswered}
                >
                  <div className="flex items-start">
                    <span className="font-bold mr-2 text-blue-400">{key}.</span>
                    <span>{value}</span>
                  </div>
                  {answeredState[questionIndex].isAnswered && key === question.answer && (
                    <div className="mt-1 text-green-400 text-sm">
                      Correct answer
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={submitQuiz}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

const QuizzesPage = () => {
  const [response, setResponse] = useState(true); // Changed to true to show the quiz immediately
  const [quizData, setQuizData] = useState([
    {
        "question": "Which factor does *not* significantly influence the rate of diffusion of a solute in a liquid?",
        "options": {
            "A": "Temperature of the liquid",
            "B": "Size and shape of the solute molecules",
            "C": "Density of the liquid",
            "D": "Initial concentration of the solute"
        },
        "answer": "D",
        "difficulty": 5
    },
    {
        "question": "Fick's first law of diffusion relates the diffusive flux to the concentration gradient.  Which statement best describes this relationship?",
        "options": {
            "A": "Flux is directly proportional to the square of the concentration gradient.",
            "B": "Flux is inversely proportional to the concentration gradient.",
            "C": "Flux is directly proportional to the concentration gradient.",
            "D": "Flux is independent of the concentration gradient."
        },
        "answer": "C",
        "difficulty": 4
    },
    {
        "question": "In facilitated diffusion, how do carrier proteins contribute to the movement of molecules across a membrane?",
        "options": {
            "A": "They provide energy for the movement of molecules against their concentration gradient.",
            "B": "They bind to molecules and change shape to transport them across the membrane down their concentration gradient.",
            "C": "They create pores in the membrane through which molecules can freely pass.",
            "D": "They actively pump molecules across the membrane using ATP."
        },
        "answer": "B",
        "difficulty": 4
    },
    {
        "question": "The diffusion coefficient (D) is a measure of how easily a substance diffuses. How does temperature typically affect D?",
        "options": {
            "A": "Increasing temperature decreases D",
            "B": "Increasing temperature has no effect on D",
            "C": "Increasing temperature increases D",
            "D": "The relationship between temperature and D is unpredictable"
        },
        "answer": "C",
        "difficulty": 5
    },
    {
        "question": "Which of the following statements correctly describes the difference between diffusion and effusion?",
        "options": {
            "A": "Diffusion is the movement of gas particles through a small opening, while effusion is the spreading of particles throughout a given volume.",
            "B": "Effusion is the movement of gas particles through a small opening, while diffusion is the spreading of particles throughout a given volume.",
            "C": "Diffusion and effusion are synonymous terms for the same process.",
            "D": "Diffusion only occurs in liquids, while effusion only occurs in gases."
        },
        "answer": "B",
        "difficulty": 6
    },
    {
        "question": "Consider the diffusion of a solute across a membrane.  If the membrane thickness doubles, how will the rate of diffusion be affected, assuming all other factors remain constant?",
        "options": {
            "A": "The rate will double.",
            "B": "The rate will be halved.",
            "C": "The rate will remain the same.",
            "D": "The rate will quadruple."
        },
        "answer": "B",
        "difficulty": 6
    },
    {
        "question": "In the context of Knudsen diffusion, which scenario leads to a higher diffusion rate?",
        "options": {
            "A": "Larger pore size compared to the mean free path of the diffusing molecule",
            "B": "Smaller pore size compared to the mean free path of the diffusing molecule",
            "C": "Pore size equal to the mean free path of the diffusing molecule",
            "D": "Knudsen diffusion is independent of pore size."
        },
        "answer": "B",
        "difficulty": 6
    }
  ]);
  
  return (
    <div className="flex flex-col xl:min-w-[700px] xl:max-w-[700px] max-xl:w-full py-8 px-6 min-h-[72%] max-h-[72%] overflow-auto bg-gray-800 mt-10">
      {!response ? (
        <div className="min-h-[60%] w-full flex flex-col items-center justify-center gap-6 text-gray-100">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open-check text-blue-400">
              <path d="M12 21V7"/>
              <path d="m16 12 2 2 4-4"/>
              <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"/>
            </svg>
          </div>
          <p>Test your knowledge with playing quizzes</p>
        </div>
      ) : (
        <QuizComponent questions={quizData} />
      )}
    </div>
  );
};

export default QuizzesPage;