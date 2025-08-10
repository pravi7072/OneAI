import React from 'react'
import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import { Eraser, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems=[
  {to:'/ai',label:'Dashboard',Icon:House},
  {to:'/ai/write-article',label:'Write Article',Icon:SquarePen},
  {to:'/ai/blog-titles',label:'Blog Titles',Icon:Hash},
  {to:'/ai/generate-images',label:'Generate Images',Icon:Image},
  {to:'/ai/remove-background',label:'Remove Background',Icon:Eraser},
  {to:'/ai/remove-object',label:'Remove Object',Icon:Scissors},
  {to:'/ai/review-resume',label:'Review Resume',Icon:FileText},
  {to:'/ai/community',label:'Community',Icon:Users}
];

const Sidebar = ({ SideBar, setSideBar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`
        bg-white border-r border-gray-200
        w-60 flex flex-col justify-between items-center
        transition-transform duration-300 ease-in-out
        h-full
        sm:relative sm:translate-x-0
        fixed top-14 left-0 z-40
        ${SideBar ? 'translate-x-0' : '-translate-x-full'} 
        sm:static
      `}
      style={{ minHeight: 'calc(100vh - 56px)' }} // Ensure full height below navbar
    >
      {/* Top Area */}
      <div className="w-full flex flex-col items-center justify-center p-7">
        <img
          src={user?.imageUrl}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover mx-auto"
        />
        <h1 className="mt-2 text-center font-semibold text-base ">
          {user?.fullName}
        </h1>
        <div className='px-2 mt-5 w-full text-sm text-gray-600 font-medium'>
          {navItems.map(({to,label,Icon})=>(
            <NavLink key={to} to={to} end={to==='/ai'} onClick={()=> setSideBar(false)}
              className={({isActive})=>
                `px-3.5 py-2.5 flex items-center gap-3 rounded transition
                ${isActive ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white' : ''}`
              }
            >
              {({isActive})=>(
                <>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      {/* Bottom Area */}
      <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between bg-white'>
        <div className='flex gap-2 items-center cursor-pointer' onClick={openUserProfile}>
          <img src={user.imageUrl} className='w-8 rounded-full' alt='profile' />
          <div>
            <h1 className='text-sm font-medium'>{user.fullName}</h1>
            <p className='text-xs text-gray-500'>
              <Protect plan='premium' fallback='Free' >Premium</Protect> Plan
            </p>
          </div>
        </div>
        <LogOut onClick={signOut} className='w-5 text-gray-400 hover:text-gray-700 transition cursor-pointer' />
      </div>
    </div>
  )
}
export default Sidebar
