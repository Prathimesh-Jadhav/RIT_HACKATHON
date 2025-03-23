import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { jsPDF } from "jspdf";
import { Button, message } from "antd";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messageRefs = useRef({});

  // Suggested questions for users
  const suggestedQuestions = [
    "What can this AI assistant help me with?",
    "Want to create your Question paper?",
    "Can you summarize a document for me?",
    "Generate question bank for data structure and algorithm",
  ];

  // Debug log for file state changes
  useEffect(() => {
    console.log("selectedFile state changed:", selectedFile);
    if (selectedFile) {
      console.log("File details:", {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        lastModified: new Date(selectedFile.lastModified).toISOString(),
      });
    }
  }, [selectedFile]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file);
    
    if (!file) {
      setSelectedFile(null);
      return;
    }
    
    // Validate file type
    const isPDF = file.type === "application/pdf";
    if (!isPDF) {
      message.error("You can only upload PDF files!");
      return;
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      message.error("File must be smaller than 10MB!");
      return;
    }
    
    console.log("File passed validation checks");
    setSelectedFile(file);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() && !selectedFile) return;
  
    // Add user message to chat
    setMessages((prev) => [...prev, { type: "user", content: input || "Please analyze this PDF" }]);
  
    // Store the message and clear input field
    const userMessage = input;
    setInput("");
  
    // Set loading state
    setIsLoading(true);
  
    try {
      let response;
      let botResponseContent;
  
      // Log and validate file before attempting upload
      console.log(
        "Selected file status:",
        selectedFile ? "File present" : "No file"
      );
  
      if (selectedFile) {
        // If file is selected, use the summarize PDF endpoint
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("user_query", userMessage || "Please summarize this document");
  
        console.log(
          "Sending PDF file:",
          selectedFile.name,
          "Size:",
          selectedFile.size,
          "Type:",
          selectedFile.type
        );
  
        // Make sure we're using the correct URL and API endpoint
        response = await axios.post(
          "http://127.0.0.1:8000/api/summarize_pdf/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        console.log("PDF API Response:", response.data);
        
        // Extract content - check for both summary and other possible fields
        botResponseContent = response.data.summary || response.data.response || 
                           response.data.message || JSON.stringify(response.data);
      } else {
        // If no file, use the regular chat endpoint
        console.log("Using regular chat endpoint with prompt:", userMessage);
        response = await axios.post(
          "http://127.0.0.1:8000/api/chat/",
          {
            prompt: userMessage,
          }
        );
  
        console.log("Chat API Response:", response.data);
        
        // Extract content based on possible response formats
        botResponseContent = response.data.response || response.data.message || 
                           response.data.answer || JSON.stringify(response.data);
      }
  
      // Add chatbot response - now with proper content extraction
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: botResponseContent,
          id: `response-${Date.now()}`,
        },
      ]);
    } catch (error) {
      console.error("Error processing request:", error);
  
      // Add detailed error message
      let errorMessage = "Error processing your request. Please try again.";
      if (error.response) {
        errorMessage = `Error: ${
          error.response.data.message || error.response.statusText
        }`;
        console.error("Server error response:", error.response.data);
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
  
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate PDF from a specific message
  const generatePDF = async (messageId, content) => {
    try {
      const messageElement = messageRefs.current[messageId];
      if (!messageElement) return;

      // Show loading indicator
      setIsLoading(true);

      // Create a new jsPDF instance (with white background)
      const pdf = new jsPDF("p", "mm", "a4");

      // Simple markdown parsing for common formats
      let parsedContent = content
        // Handle bold text (**text**)
        .replace(/\*\*(.*?)\*\*/g, "$1")
        // Handle italics (*text* or _text_)
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/_(.*?)_/g, "$1")
        // Handle code blocks (`code`)
        .replace(/`(.*?)`/g, "$1")
        // Handle headers (remove # symbols)
        .replace(/^#{1,6}\s+(.*)$/gm, "$1")
        // Handle bullet lists (- item or * item)
        .replace(/^[-*]\s+(.*)$/gm, "• $1")
        // Handle numbered lists (1. item)
        .replace(/^\d+\.\s+(.*)$/gm, "• $1")
        // Handle links ([text](url))
        .replace(/\[(.*?)\]\((.*?)\)/g, "$1");

      // Add a title to the PDF
      pdf.setTextColor(0, 0, 0); // Black text
      pdf.setFontSize(16);
      pdf.text("AI Assistant Response", 15, 15);

      // Add timestamp
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100); // Gray text
      const timestamp = new Date().toLocaleString();
      pdf.text(`Generated on: ${timestamp}`, 15, 22);

      // Add a horizontal line
      pdf.setDrawColor(200, 200, 200); // Light gray line
      pdf.line(15, 25, 195, 25);

      // Set font for main content
      pdf.setTextColor(0, 0, 0); // Black text
      pdf.setFontSize(11);

      // Split content into lines to avoid text running off the page
      // Use a narrower width to ensure content fits within margins
      const textLines = pdf.splitTextToSize(parsedContent, 170);

      // Add text content starting from position after the header
      let verticalPosition = 30;

      // Process lines in chunks to avoid exceeding page bounds
      for (let i = 0; i < textLines.length; i++) {
        // If we're about to exceed page height, add a new page
        if (verticalPosition > 270) {
          pdf.addPage();
          verticalPosition = 20; // Reset position for new page
        }

        pdf.text(textLines[i], 15, verticalPosition);
        verticalPosition += 7; // Increment vertical position for next line
      }

      // Add page numbers at the bottom of each page
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pdf.internal.pageSize.width / 2,
          287,
          { align: "center" }
        );
      }

      // Download the PDF
      pdf.save(`ai-response-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Show error message to user
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          content: "Error generating PDF. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[91.3vh] bg-gray-900 text-gray-200">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center mt-10 space-y-6">
            <div className="text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <p className="text-xl mb-2 font-medium">
                Welcome to the AI LMS Assistant!
              </p>
              <p className="text-gray-400">Ask a question or upload a PDF to get started</p>
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
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type !== "user" && message.type !== "system" && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
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
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <div
                ref={(el) =>
                  message.id && (messageRefs.current[message.id] = el)
                }
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg shadow ${
                  message.type === "user"
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : message.type === "system"
                    ? "bg-gray-700 text-gray-200"
                    : "bg-gray-800 border border-gray-700 text-gray-200 rounded-tl-none"
                }`}
              >
                <div className="relative">
                  <MarkdownPreview
                    source={message.content}
                    style={{
                      backgroundColor: "transparent",
                      color: "#fff",
                    }}
                  />

                  {/* PDF Download button for bot messages */}
                  {message.type === "bot" && (
                    <button
                      onClick={() => generatePDF(message.id, message.content)}
                      className="absolute top-0 right-0 bg-gray-700 hover:bg-gray-600 text-gray-300 p-1 rounded-full text-xs transition-colors"
                      title="Download as PDF"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              {message.type === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center ml-2">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area with file input - FIXED FILE SELECTION */}
      <div className="border-t border-gray-700 p-4 bg-gray-800">
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            {/* File input - FIXED VERSION */}
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
                disabled={isLoading}
              />
              <Button 
                className={`${selectedFile ? 'bg-green-700' : 'bg-blue-600'} text-white`}
                disabled={isLoading}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? "Change PDF" : "Select PDF"}
              </Button>
            </div>

            {selectedFile && (
              <div className="flex items-center bg-gray-700 text-gray-200 px-3 py-1 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="truncate max-w-xs">{selectedFile.name}</span>
                <button
                  onClick={clearSelectedFile}
                  className="ml-2 text-gray-400 hover:text-gray-200"
                  title="Remove file"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={
              selectedFile
                ? "Ask a question about the PDF..."
                : "Type your message here..."
            }
            className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            disabled={isLoading}
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full disabled:opacity-50 transition-colors"
            disabled={isLoading}
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
        </form>
      </div>
    </div>
  );
};

export default Chatbot;