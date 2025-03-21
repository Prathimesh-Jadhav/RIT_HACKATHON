import React from 'react'
import Home from '../sections/Home'
import FeatureCard from '../components/FeatureCard'
import Navbar from '../components/Navbar'
import Feautres from '../sections/Feautres'

const LandingPage = () => {
  return (
    <div className='bg-gray-900 text-white'>
      <Navbar />
      <Home />
      <Feautres/>
    </div>
  )
}

export default LandingPage
