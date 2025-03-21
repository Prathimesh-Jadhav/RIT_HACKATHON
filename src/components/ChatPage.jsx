import React from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'

const ChatPage = ({ chatResponse }) => {
  return (
    <div className='flex flex-col items-center justify-start xl:min-w-[900px] xl:max-w-[700px] max-xl:w-full py-8 px-6 min-h-[80%] overflow-y-auto'>
      {chatResponse && chatResponse.length > 0 ? (
        <div className="w-full prose prose-invert max-w-none">
          <MarkdownPreview 
            source={chatResponse}
            style={{
              backgroundColor: 'transparent',
              color: '#fff'
            }}
          />
        </div>
      ) : (
        <div className='min-h-[60%] w-full flex flex-col items-center justify-center gap-6'>
          <div className="text-gray-600">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="44" 
              height="44" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-file-question"
            >
              <path d="M12 17h.01"/>
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/>
              <path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/>
            </svg>
          </div>
          <p className="text-white-600 text-lg text-center">Ask your questions <br></br> AI will respond based on your faculty's notes</p>
        </div>
      )}
    </div>
  )
}

export default ChatPage
