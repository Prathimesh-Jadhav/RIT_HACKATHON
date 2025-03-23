import { useState } from "react";
import { Upload, ArrowUp, Loader2 } from "lucide-react";
import axios from "axios";

const ChatInput = ({setSelectedPage, selectedPage, setChatResponse, setVisualizeResponse, setQuizResponse}) => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePrompt = (e) => {
    setPrompt(e.target.value);
  }

  const submitQuery = async () => {
    if(selectedPage === 'Chat' && prompt.trim()) {
      setIsLoading(true);
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat/`, {
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
        setIsLoading(false);
      }
    }
    else if(selectedPage === 'Visualize') {

    }
    else if(selectedPage === 'Quizzes' && prompt.trim()) {
      console.log('Generating quiz for:', prompt);
        setQuizResponse(prompt)
    }
  }

  return (
    <div className="flex flex-col bg-gray-800 p-3 rounded-2xl w-full max-w-3xl mx-auto xl:min-w-[700px]">
      {/* Input Field */}
      <input
        type="text"
        placeholder="Type a message..."
        onChange={handlePrompt}
        value={prompt}
        className="bg-gray-800 text-white px-4 py-2 mb-3 rounded-lg outline-none w-full"
      />

      {/* Buttons Section */}
      <div className="flex items-center gap-4">
        {/* Upload Button */}
        {/* <label className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer">
          <Upload className="text-gray-400 w-5 h-5" />
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label> */}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600" onClick={() => setSelectedPage('Chat')}>
            Chat
          </button>
          <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600" onClick={() => setSelectedPage('Quizzes')}>
            Quizzes
          </button>
        </div>

        {/* Send Button */}
        <button 
          className={`ml-auto flex items-center justify-center w-10 h-10 rounded-full ${!isLoading && prompt.trim() ? 'bg-white text-black hover:bg-gray-300' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
          onClick={submitQuery}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
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
