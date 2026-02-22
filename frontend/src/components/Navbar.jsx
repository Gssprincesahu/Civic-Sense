import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import map1 from "../assets/map1.png";
import issue1 from "../assets/issue1.png";
import home1 from "../assets/home1.png";
import leaderboard1 from "../assets/leaderboard1.png";
import { useAuth } from "../context/AuthProvider";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, authUser, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-[#002147] text-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo / Name with animation */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold transform transition-all duration-300 group-hover:scale-110 text-[#F4C430]">
              Naagrik
            </span>
          </Link>

          {/* Desktop Menu with enhanced animations */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-1 group relative overflow-hidden px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10">
              <span className="transform transition-all duration-300 group-hover:text-[#F4C430]">Home</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F4C430] transition-all duration-300 group-hover:w-full"></div>
            </Link>
            
            <Link to="/Issue" className="flex items-center space-x-1 group relative overflow-hidden px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10">
              <span className="transform transition-all duration-300 group-hover:text-[#F4C430]">Issue</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F4C430] transition-all duration-300 group-hover:w-full"></div>
            </Link>
            
            <Link to="/Map" className="flex items-center space-x-1 group relative overflow-hidden px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10">
              <span className="transform transition-all duration-300 group-hover:text-[#F4C430]">Map View</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F4C430] transition-all duration-300 group-hover:w-full"></div>
            </Link>
            
            <Link to="/Leaderboard" className="flex items-center space-x-1 group relative overflow-hidden px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10">
              <span className="transform transition-all duration-300 group-hover:text-[#F4C430]">Leaderboard</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F4C430] transition-all duration-300 group-hover:w-full"></div>
            </Link>
          </div>

          {/* Right Side Buttons with animations */}
          <div className="hidden md:flex items-center gap-4">
            {/* Protected "Report Issue" Button - Only shows when authenticated */}
            {!loading && isAuthenticated && (
              <Link to="/ReportIssue" className="relative px-4 py-2 rounded-md text-sm font-medium bg-white/10 text-white overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <span className="relative z-10 transition-colors duration-300">Report Issue</span>
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></div>
              </Link>
            )}
            
            {/* Authentication Section */}
            {!loading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium bg-white/10 px-3 py-1.5 rounded-lg">
                      Welcome, {authUser?.username}
                    </span>
                    <button 
                      onClick={handleLogout} 
                      className="px-4 py-2 bg-[#F4C430] text-[#002147] rounded-md hover:bg-[#E6B800] transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link to="/Login" className="relative px-4 py-2 rounded-md text-sm font-medium bg-white/10 text-white border border-white/30 overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-0.5">
                      <span className="relative z-10 font-semibold">Login</span>
                      <div className="absolute inset-0 bg-white/20 transform scale-0 transition-transform duration-300 group-hover:scale-100 rounded-md"></div>
                    </Link>
                    <Link to="/Signup" className="relative px-4 py-2 rounded-md text-sm font-medium bg-[#F4C430] text-[#002147] overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-0.5">
                      <span className="relative z-10 font-semibold">Sign up</span>
                      <div className="absolute inset-0 bg-[#E6B800] transform scale-0 transition-transform duration-300 group-hover:scale-100 rounded-md"></div>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button with animation */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-all duration-300 hover:bg-white/10 transform hover:scale-110"
            >
              <svg
                className={`h-6 w-6 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with slide animation */}
      <div className={`md:hidden bg-[#002147] overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pb-3 space-y-2">
          <Link 
            to="/" 
            className="block py-2 px-3 rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-[#F4C430] transform hover:translate-x-2"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/Issue" 
            className="block py-2 px-3 rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-[#F4C430] transform hover:translate-x-2"
            onClick={() => setIsOpen(false)}
          >
            Issue
          </Link>
          <Link 
            to="/Map" 
            className="block py-2 px-3 rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-[#F4C430] transform hover:translate-x-2"
            onClick={() => setIsOpen(false)}
          >
            Map View
          </Link>
          <Link 
            to="/Leaderboard" 
            className="block py-2 px-3 rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-[#F4C430] transform hover:translate-x-2"
            onClick={() => setIsOpen(false)}
          >
            Leaderboard
          </Link>
          
          {/* Mobile Auth Section */}
          {!loading && isAuthenticated && (
            <Link 
              to="/ReportIssue" 
              className="block py-2 px-3 bg-white/10 rounded-lg transition-all duration-200 hover:bg-white/20 transform hover:translate-x-2"
              onClick={() => setIsOpen(false)}
            >
              Report Issue
            </Link>
          )}
          
          {!loading && (
            <>
              {isAuthenticated ? (
                <>
                  <div className="py-2 px-3 text-sm">Welcome, {authUser?.username}</div>
                  <button 
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="block w-full text-left text-[#002147] bg-[#F4C430] px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-[#E6B800] hover:shadow-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2 mt-3">
                  <Link 
                    to="/Login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center text-white bg-white/10 border border-white/30 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-white/20 hover:shadow-md transform hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/Signup"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center text-[#002147] bg-[#F4C430] px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-[#E6B800] hover:shadow-md transform hover:scale-105"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;