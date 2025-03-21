import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

function App() {

  return (
    <>
      <Router>
            <Routes>
              <Route path="/" element={<LandingPage/>} />
            </Routes>
       </Router>
    </>
  )
}

export default App
