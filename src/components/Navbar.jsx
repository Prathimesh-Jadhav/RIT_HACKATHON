import React from 'react'

const Navbar = () => {
  return (
    <div className='w-full h-16 bg-transparent text-white flex items-center justify-between px-10 font-inter'>
        <h1 className='text-2xl font-bold'>SmartEdu</h1>
        <div>
            <button className='mr-4'>Hero</button>
            <button className='mr-4'>Features</button>
        </div>
    </div>
  )
}

export default Navbar
