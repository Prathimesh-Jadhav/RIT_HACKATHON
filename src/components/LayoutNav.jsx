import React from 'react'
import { Link } from 'react-router-dom'
import { navOptions } from '../data'

const LayoutNav = () => {

    const role = 'student'
  return (
    <div className="w-full h-16 bg-gray-800 text-white flex items-center justify-between lg:px-10 max-lg:px-4 font-inter gap-6">
      <div className='text-2xl font-bold' >AI-Powered LMS</div>
      <ul className='flex gap-4 items-center'>
        {
           navOptions[role].map((option, index) => (
            <Link key={index} to={option.path}>{option.name}</Link>
          ))
        }
      </ul>
    </div>
  )
}

export default LayoutNav
