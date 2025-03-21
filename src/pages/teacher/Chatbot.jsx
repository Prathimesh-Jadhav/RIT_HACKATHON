import React, { useState, useRef } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Suggested questions for users
  const suggestedQuestions = [
    "What can this AI assistant help me with?",
    "How do I analyze data with this tool?",
    "Can you summarize a document for me?",
    "What file formats do you support?",
    "How do I export conversation history?"
  ];

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      // Add a system message showing file was uploaded
      setMessages(prev => [...prev, {
        type: 'system',
        content: `File uploaded: ${file.name}`
      }]);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() && !uploadedFile) return;

    // Add user message to chat
    const userMessage = input || (uploadedFile ? `I've uploaded ${uploadedFile.name}` : '');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInput('');
    
    // Set loading state
    setIsLoading(true);

    try {
      // Here you would normally make an API call to your chatbot backend
      // For demonstration, we're simulating a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let responseContent = '';
      if (uploadedFile) {
        responseContent = `I've analyzed ${uploadedFile.name}. What would you like to know about it?`;
        setUploadedFile(null); // Clear the file after processing
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset the file input
        }
      } else {
        // Create custom responses based on common questions
        if (userMessage.toLowerCase().includes("help")) {
          responseContent = "I can help you analyze documents, answer questions, summarize content, and provide information on various topics. Just ask away or upload a file!";
        } else if (userMessage.toLowerCase().includes("file format")) {
          responseContent = "I support most common file formats including PDF, DOCX, TXT, CSV, XLSX, and JSON. Just upload your file using the + button.";
        } else if (userMessage.toLowerCase().includes("export")) {
          responseContent = "To export your conversation history, look for the download icon in the top right corner of the chat interface.";
        } else {
          responseContent = `Thanks for your message: "${userMessage}". This is a simulated response.`;
        }
      }
      
      // Add chatbot response
      setMessages(prev => [...prev, { type: 'bot', content: responseContent }]);
    } catch (error) {
      // Add error message
      setMessages(prev => [...prev, {
        type: 'system',
        content: 'Error processing your request. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom whenever messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[91.3vh] bg-gray-900 text-gray-200">

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center mt-10 space-y-6">
            <div className="text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-xl mb-2 font-medium">Welcome to the AI Assistant!</p>
              <p className="text-gray-400">Ask a question or upload a document to get started</p>
            </div>
            
            <div className="max-w-lg mx-auto">
              <h3 className="font-medium text-indigo-400 mb-2">Try asking:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type !== 'user' && message.type !== 'system' && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div 
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg shadow ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white rounded-tr-none' 
                    : message.type === 'system'
                    ? 'bg-gray-700 text-gray-200'
                    : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-tl-none'
                }`}
              >
                {message.content}
              </div>
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-700 p-4 bg-gray-800">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
              title="Upload file"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </button>
            
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              disabled={isLoading}
            />
            
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full disabled:opacity-50 transition-colors"
              disabled={isLoading && !uploadedFile}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="none" 
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                  />
                </svg>
              ) : (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M14 5l7 7m0 0l-7 7m7-7H3" 
                  />
                </svg>
              )}
            </button>
          </div>
          
          {uploadedFile && (
            <div className="flex items-center text-sm text-gray-300 bg-gray-700 p-2 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate">{uploadedFile.name}</span>
              <button
                type="button"
                onClick={() => {
                  setUploadedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="ml-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Chatbot;