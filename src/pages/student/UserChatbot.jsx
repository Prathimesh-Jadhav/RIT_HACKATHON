import React, { useState } from 'react'
import ChatInput from '../../components/ChatInput'
import ChatPage from '../../components/ChatPage'
import VisualizePage from '../../components/VisualizePage'
import QuizzesPage from '../../components/QuizzesPage'

const UserChatbot = () => {

    const [selectedPage,setSelectedPage] = useState('Chat')
    const [chatResponse,setChatResponse] = useState('')
    const [visualizeResponse,setVisualizeResponse] = useState('')
    const [quizResponse,setQuizResponse] = useState('')

  return (
    <div className='w-full h-[91.3vh] font-inter bg-gray-900 text-white relative flex justify-center'>
      <div className='relative flex flex-col justify-between mb-4'>
        {
            selectedPage === 'Chat' && <ChatPage chatResponse={chatResponse} />
        }
        {
            selectedPage === 'Visualize' && <VisualizePage visualizeResponse={visualizeResponse}/>
        }
        {
            selectedPage === 'Quizzes' && <QuizzesPage quizResponse={quizResponse}/>
        }
      <ChatInput setSelectedPage={setSelectedPage} selectedPage={selectedPage} setChatResponse={setChatResponse} setVisualizeResponse={setVisualizeResponse} setQuizResponse={setQuizResponse}/>
      </div>
    </div>
  )
}

export default UserChatbot
