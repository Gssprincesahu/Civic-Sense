import React from "react";


import { Link } from "react-router-dom";
import map1 from "../assets/map1.png";
import issue1 from "../assets/issue1.png";
import home1 from "../assets/home1.png";
import leaderboard1 from "../assets/leaderboard1.png";


const Navbar = () => {
  return (
    <nav className="w-full bg-gradient-to-r from-indigo-900 via-purple-700 to-pink-600 text-slate-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-400 shadow-lg">
              {/* compact SVG monogram */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="22" height="22" rx="5" fill="rgba(255,255,255,0.08)"/>
                <path d="M6 16V8h3.2l2.8 4.5L15.8 8H19v8h-2.2v-4.5L14 13.5 11.2 11V16H6z" fill="white"/>
              </svg>
            </span>
            <div className="leading-tight">
              <div className="text-white text-lg md:text-xl font-semibold bg-clip-text  bg-gradient-to-r from-white to-pink-100">
                Naagrik
              </div>
              <div className="text-xs text-indigo-100">Report & Resolve</div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-indigo-100 hover:text-white transition-colors flex items-center gap-2">
              <img src={home1} alt="Logo" className="h-6 w-6" />
              <span>Home</span>
            </Link>
            <Link
              to="/Issue"
              className="text-indigo-100 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <img src={issue1} alt="Logo" className="h-6 w-6" />
                <span>Issue</span>
              </div>
            </Link>
            <Link
              to="/Map"
              className="text-indigo-100 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <img src={map1} alt="Logo" className="h-6 w-6" />
                <span>Map View</span>
              </div>
            </Link>
            <Link
              to="/leaderboard"
              className="text-indigo-100 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <img src={leaderboard1} alt="Logo" className="h-6 w-6" />
                <span>Leaderboard</span>
              </div>
            </Link>
          </div>

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/issues" className="px-3 py-1.5 rounded-md text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition">
               Report Issue
             </Link>
             <Link to="/Signup" className="px-3 py-1.5 rounded-md text-sm font-medium bg-white text-indigo-700 hover:opacity-95 transition">
               Sign up
             </Link>
           </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            {/* ...existing code... (you can add a hamburger button here if desired) */}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
