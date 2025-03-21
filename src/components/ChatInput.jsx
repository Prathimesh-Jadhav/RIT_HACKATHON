import { useState } from "react";
import { Upload, ArrowUp, Loader2 } from "lucide-react";
import axios from "axios";

const ChatInput = ({
  setSelectedPage, 
  selectedPage, 
  setChatResponse, 
  setVisualizeResponse, 
  setQuizResponse,
  setIsLoading
}) => {
  const [prompt, setPrompt] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handlePrompt = (e) => {
    setPrompt(e.target.value);
  }

  const submitQuery = async () => {
    if(selectedPage === 'Chat' && prompt.trim()) {
      setLocalLoading(true);
      setIsLoading(true);
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/chat/', {
          prompt: prompt
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if(response.status === 200) {
          setChatResponse(response.data.response);
          setPrompt(''); // Clear input after successful response
        }
      }
      catch(err) {
        console.log(err);
        setChatResponse("Sorry, there was an error processing your request.");
      }
      finally {
        setLocalLoading(false);
        setIsLoading(false);
      }
    }
    else if(selectedPage === 'Visualize' && prompt.trim()) {
      // Visualize implementation
      setLocalLoading(true);
      setIsLoading(true);
      // Add your code here
      setLocalLoading(false);
      setIsLoading(false);
    }
    else if (selectedPage === 'Quizzes' && prompt.trim()) {
      setLocalLoading(true);
      setIsLoading(true);
      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/quiz/',
          { prompt: prompt },
          { headers: { 'Content-Type': 'application/json' } }
        );
    
        console.log("Full API Response:", response.data); // Debugging log
    
        if (response.status === 200 && response.data && Array.isArray(response.data.mcqs)) {
          setQuizResponse(response.data.mcqs);
          console.log("MCQs Set in State:", response.data.mcqs); // Debugging log
        } else {
          console.warn("Unexpected API response format:", response.data);
          setQuizResponse("Invalid response format. Please try again.");
        }
    
        setPrompt(''); // Clear input after successful response
      } catch (err) {
        console.error("Quiz API Error:", err);
        setQuizResponse("Sorry, there was an error processing your request.");
      } finally {
        setLocalLoading(false);
        setIsLoading(false);
      }
    }
  }

  // Reset displayed content when switching pages
  const handlePageChange = (page) => {
    setSelectedPage(page);
    // Optionally clear responses when switching pages
    if (page === 'Chat') {
      setQuizResponse(null);
      setVisualizeResponse(null);
    } else if (page === 'Quizzes') {
      setChatResponse(null);
      setVisualizeResponse(null);
    } else if (page === 'Visualize') {
      setChatResponse(null);
      setQuizResponse(null);
    }
  };

  return (
    <div className="flex flex-col bg-gray-800 p-3 rounded-2xl w-full max-w-3xl mx-auto xl:min-w-[700px]">
      {/* Input Field */}
      <input
        type="text"
        placeholder={
          selectedPage === 'Chat' ? "Ask me anything..." :
          selectedPage === 'Quizzes' ? "Enter a topic for quiz questions..." :
          "Describe what you want to visualize..."
        }
        onChange={handlePrompt}
        value={prompt}
        className="bg-gray-800 text-white px-4 py-2 mb-3 rounded-lg outline-none w-full"
      />

      {/* Buttons Section */}
      <div className="flex items-center gap-4">
        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button 
            className={`px-4 py-2 ${selectedPage === 'Chat' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'} rounded-full hover:bg-blue-700`} 
            onClick={() => handlePageChange('Chat')}
          >
            Chat
          </button>
          <button 
            className={`px-4 py-2 ${selectedPage === 'Visualize' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'} rounded-full hover:bg-blue-700`} 
            onClick={() => handlePageChange('Visualize')}
          >
            Visualize
          </button>
          <button 
            className={`px-4 py-2 ${selectedPage === 'Quizzes' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'} rounded-full hover:bg-blue-700`} 
            onClick={() => handlePageChange('Quizzes')}
          >
            Quizzes
          </button>
        </div>

        {/* Send Button */}
        <button 
          className={`ml-auto flex items-center justify-center w-10 h-10 rounded-full ${!localLoading && prompt.trim() ? 'bg-white text-black hover:bg-gray-300' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
          onClick={submitQuery}
          disabled={localLoading || !prompt.trim()}
        >
          {localLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ArrowUp className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;