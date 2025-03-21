import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Chatbot from './pages/teacher/Chatbot'
import UploadPage from './pages/teacher/Upload'
import Layout from './pages/Layout'
import { User } from 'lucide-react'
import UserChatbot from './pages/student/UserChatbot'

function App() {

  return (
    <>
      <Router>
            <Routes>
              <Route path="/" element={<LandingPage/>} />
              <Route path="/layout" element={<Layout/>}>
                <Route path="teacher/chatbot" element={<Chatbot/>} />
                <Route path="student/chatbot" element={<UserChatbot/>} />
                <Route path="teacher/generate-notes" element={<UploadPage/>} />
                <Route path="student/quizzes" element={<UploadPage/>} />
                <Route path="student/visualize" element={<UploadPage/>} />
              </Route>
            </Routes>
       </Router>
    </>
  )
}

export default App
