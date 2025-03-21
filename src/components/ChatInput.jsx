import { useState } from "react";
import { Upload, ArrowUp } from "lucide-react";
import axios from "axios";

const ChatInput = ({setSelectedPage, selectedPage ,setChatResponse,setVisualizeResponse,setQuizResponse}) => {
  const [file, setFile] = useState(null);
  const [prompt,setPrompt] = useState('');

  const handlePrompt = (e)=>{
    setPrompt(e.target.value);
  }

  const submitQuery = async ()=>{
    if(selectedPage==='Chat'){
      // call chat api
      try{
        const response = await axios.post('​http://192.168.145.40:8000/api/chat​',{prompt},{
          headers:'application/json'
        })

        if(response.status===200){
          console.log(response.response);
          setChatResponse(response.response);
        }
      }
      catch(err){
        console.log(err);
      }
      
    }
    else if(selectedPage=='Visualize'){
      try{
        const response = await axios.post('​http://192.168.145.40:8000/api/chat/​',{prompt},{
          headers:'application/json'
        })

        if(response.status===200){
          console.log(response.response);
          setChatResponse(response.response);
        }
      }
      catch(err){
        console.log(err);
      }

    }
    else if(selectedPage=='Quizzes'){
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
      <div className="flex items-center  gap-4">
        {/* Upload Button */}
        {/* <label className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer">
          <Upload className="text-gray-400 w-5 h-5" />
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label> */}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
        <button className=" px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600" onClick={() => setSelectedPage('Chat')}>
          Chat
        </button>
        <button className=" px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600" onClick={() => setSelectedPage('Visualize')}>
          Visulaize
        </button>
        <button className=" px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600" onClick={() => setSelectedPage('Quizzes')}>
          Quizzes
        </button>
        </div>

        {/* Send Button */}
        <button className="ml-auto flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-gray-300" onClick={submitQuery}>
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
