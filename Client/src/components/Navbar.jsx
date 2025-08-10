import React, { useEffect, useState, useRef } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  // State to control visibility
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0); // To store last scroll position

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 0) return; // Prevent negative scroll (mobile overscroll)

      if (currentScrollY < 50) {
        // At the top - always show navbar
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down - hide navbar
        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up - show navbar immediately
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 z-50 w-full backdrop-blur-2xl py-3 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-56 flex justify-between items-center transition-transform duration-300 ease-in-out ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <img
        src={assets.logo}
        alt="logo"
        className="w-24 sm:w-36 md:w-44 lg:w-56 cursor-pointer transition-all duration-300"
        onClick={() => navigate('/')}
      />

      {user ? (
        <div className="ml-2 sm:ml-6">
          <UserButton />
        </div>
      ) : (
        <button
          onClick={openSignIn}
          className="flex items-center gap-2 rounded-full text-xs sm:text-sm md:text-base cursor-pointer bg-primary text-white px-6 py-2 sm:px-8 sm:py-2.5 transition-all duration-300"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
