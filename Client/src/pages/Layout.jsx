import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { SignIn, useUser } from '@clerk/clerk-react'

const NAV_HEIGHT = 56 // h-14 = 56px

const Layout = () => {
  const navigate = useNavigate();
  const [sideBar, setSideBar] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className="w-screen h-screen overflow-hidden bg-[#F4F7FB]">
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 w-full h-14 px-4 sm:px-8
          flex items-center justify-between border-b border-gray-200 bg-white z-50"
      >
        <img
          src={assets.logo}
          alt="logo"
          className="w-32 cursor-pointer"
          onClick={() => navigate('/')}
        />
        {sideBar ? (
          <X
            onClick={() => setSideBar(false)}
            className="w-7 h-7 text-gray-600 sm:hidden cursor-pointer"
          />
        ) : (
          <Menu
            onClick={() => setSideBar(true)}
            className="w-7 h-7 text-gray-600 sm:hidden cursor-pointer"
          />
        )}
      </nav>
      {/* Flex row below navbar */}
      <div
        className="flex pt-14 h-full w-full relative"
        style={{
          height: `calc(100vh - ${NAV_HEIGHT}px)`,
        }}
      >
        {/* Sidebar */}
        <Sidebar SideBar={sideBar} setSideBar={setSideBar} />
        {/* sidebar overlay mobile only */}
        {sideBar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 sm:hidden z-30"
            onClick={() => setSideBar(false)}
          />
        )}
        {/* main content */}
        <div className="flex-1 h-full bg-[#F4F7FB] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <SignIn />
    </div>
  );
}

export default Layout
