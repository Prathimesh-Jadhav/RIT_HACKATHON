import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizComponent = ({ prompt }) => {
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);
  const [answeredState, setAnsweredState] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Generate quiz whenever prompt changes
  useEffect(() => {
    if (prompt && prompt.trim()) {
      fetchQuizData(prompt);
    }
  }, [prompt]);

  const fetchQuizData = async (promptText) => {
    setLoading(true);
    setError(null);
    setShowResults(false);
    setScore(0);

    console.log(promptText);
    
    try {
      // Make API call to fetch quiz data based on the prompt
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/`, 
        { prompt: promptText },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(response.data);
      
      if (!response.data.status || response.data.status !== "success") {
        throw new Error(`API request failed`);
      }
      
      // The data is already parsed by axios - no need to call .json()
      const newQuizData = response.data.mcqs;
      
      setQuizData(newQuizData);
      // Initialize answered state for new questions
      setAnsweredState(newQuizData.map(() => ({
        isAnswered: false,
        selectedOption: null
      })));
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionIndex, option) => {
    if (answeredState[questionIndex].isAnswered) return;
    
    const newAnsweredState = [...answeredState];
    newAnsweredState[questionIndex] = {
      isAnswered: true,
      selectedOption: option
    };
    
    setAnsweredState(newAnsweredState);
    
    if (option === quizData[questionIndex].answer) {
      setScore(score + 1);
    }
    
    // If all questions are answered, show results
    const allAnswered = newAnsweredState.every(state => state.isAnswered);
    if (allAnswered) {
      setShowResults(true);
    }
  };

  const getOptionClass = (questionIndex, option) => {
    if (!answeredState[questionIndex].isAnswered) return "bg-gray-800 hover:bg-gray-700 border-gray-600";
    if (option === quizData[questionIndex].answer) return "bg-green-900 border-green-500";
    if (option === answeredState[questionIndex].selectedOption) return "bg-red-900 border-red-500";
    return "bg-gray-800 opacity-60 border-gray-600";
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-lg shadow-lg text-gray-100">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-lg shadow-lg text-gray-100">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-lg shadow-lg text-gray-100">
        <div className="min-h-[60%] w-full flex flex-col items-center justify-center gap-6 text-gray-100 py-12">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open-check text-blue-400">
              <path d="M12 21V7"/>
              <path d="m16 12 2 2 4-4"/>
              <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"/>
            </svg>
          </div>
          <p>Waiting for a quiz topic...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-lg shadow-lg text-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6">Quiz Results</h2>
        <p className="text-xl text-center mb-6">
          Your score: <span className="font-bold text-blue-400">{score}</span> out of {quizData.length}
        </p>
        
        <div className="space-y-6 mb-6">
          {quizData.map((question, index) => (
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
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-lg shadow-lg text-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Quiz</h1>
        <span className="text-sm font-medium text-blue-400">
          {answeredState.filter(state => state.isAnswered).length} of {quizData.length} answered
        </span>
      </div>
      
      <div className="space-y-8 mb-6">
        {quizData.map((question, questionIndex) => (
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
    </div>
  );
};

// Updated main component
const QuizzesPage = ({ quizResponse }) => {
  console.log(quizResponse);
  return (
    <div className="flex flex-col xl:min-w-[700px] xl:max-w-[700px] max-xl:w-full py-8 px-6 min-h-[72%] max-h-[72%] overflow-auto bg-gray-800 mt-10">
      <QuizComponent prompt={quizResponse} />
    </div>
  );
};

export default QuizzesPage;