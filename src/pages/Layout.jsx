import React from 'react'
import LayoutNav from '../components/LayoutNav'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='w-full h-screen bg-gray-100'>
          <LayoutNav/>
          <Outlet/>
    </div>
  )
}

export default Layout
