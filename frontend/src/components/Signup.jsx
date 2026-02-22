import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import axios from "axios";
import Login from "./Login";

export default function Signup() {
  const [showLogin, setShowLogin] = useState(false);
  
  useEffect(() => {
  if (showLogin) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
  // Clean up on unmount
  return () => {
    document.body.style.overflow = "";
  };
}, [showLogin]);

  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setFlash({ type: "", message: "" });
    try {
      const res = await axios.post("http://localhost:5001/api/user/signup", {
        username: data.username,
        email: data.email,
        password: data.password,
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
      setFlash({ type: "success", message: res.data?.message || "Account created successfully" });
    } catch (err) {
      setFlash({ type: "error", message: err?.response?.data?.message || "Server not responding" });
    } finally {
      setLoading(false);
    }
  }

  // Google Sign-In handler
  const handleGoogleSignup = async (response) => {
    setLoading(true);
    setFlash({ type: "", message: "" });
    try {
      // Send Google token to backend for signup/login
      const res = await axios.post("http://localhost:5001/api/user/google-signup", {
        token: response.credential,
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setFlash({ type: "success", message: res.data?.message || "Signed up with Google!" });
    } catch (err) {
      setFlash({ type: "error", message: err?.response?.data?.message || "Google signup failed" });
    } finally {
      setLoading(false);
    }
  };

  // Load Google Identity Services script and render button
  const googleBtnRef = useRef(null);
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId || googleClientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      console.warn('Google Client ID not configured. Google Sign-In will not work.');
      return;
    }
    
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleSignup,
        });
        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(
            googleBtnRef.current,
            { theme: "outline", size: "large", text: "signup_with" }
          );
        }
      };
      document.body.appendChild(script);
    } else {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleSignup,
      });
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(
          googleBtnRef.current,
          { theme: "outline", size: "large", text: "signup_with" }
        );
      }
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState({ type: "", message: "" });

  return (
    
    <div className="min-h-screen  flex items-center justify-center bg-[#002147] py-12 px-4 relative overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating shapes */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-[#F4C430]/20 to-[#E6B800]/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-[#F4C430]/15 to-[#E6B800]/15 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-r from-[#F4C430]/10 to-[#E6B800]/10 rounded-full blur-2xl animate-pulse-slow"></div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 15 + 8}px`,
              height: `${Math.random() * 15 + 8}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 4 + 3}s`
            }}
          ></div>
        ))}
        
        {/* Moving geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-gradient-to-r from-[#F4C430]/25 to-[#E6B800]/25 rounded-lg rotate-45 animate-rotate-slow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-gradient-to-r from-[#F4C430]/25 to-[#E6B800]/25 rounded-full animate-bounce-gentle"></div>
      </div>
      
      <div className="w-full max-w-md  relative z-10">
        <div className="bg-white/95 shadow-lg  rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F4C430]">
                {/* simple inline logo */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="22" height="22" rx="5" fill="rgba(0,33,71,0.2)" />
                  <path d="M6 16V8h3.2l2.8 4.5L15.8 8H19v8h-2.2v-4.5L14 13.5 11.2 11V16H6z" fill="#002147" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[#002147]">Sign in to Naagrik</h1>
                <p className="text-sm text-gray-600">Report issues and track resolutions</p>
              </div>
              <div className="ml-auto text-gray-700 hover:text-gray-900  text-xl cursor-pointer rounded-full p-1 transition shadow-2xl shadow-blue-700">
                <Link to="/" > X </Link>
              </div>
            </div>

            {flash.message && (
              <div
                className={`mb-4 text-sm px-3 py-2 rounded-md ${flash.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}
                role="status"
              >
                {flash.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} method="dialog" >

              <label className="block mb-3">
                <span className="text-sm font-medium text-gray-700">UserName</span>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-200 border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F4C430]"
                  placeholder="Eneter your username"
                  {...register("username", { required: true })} />
                {errors.username && <span className='text-sm text-red-500'>This field is required</span>}
              </label>

              <label className="block mb-3">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  className="mt-1 block w-full rounded-md border-gray-200 border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F4C430]"
                  placeholder="you@example.com"
                  {...register("email", { required: true })} />
                {errors.email && <span className='text-sm text-red-500'>This field is required</span>}
              </label>


              <label className="block mb-3 relative">
                <span className="text-sm font-medium text-gray-700">Password</span>
                <div className="mt-1 relative">
                  <input
                    type="password"
                    autoComplete="new-password"
                    className="block w-full rounded-md border-gray-200 border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#F4C430]"
                    placeholder="Enter your password"
                    {...register("password", { required: true })} />
                  {errors.password && <span className='text-sm text-red-500'>This field is required</span>}
                </div>
              </label>

              <div className="flex items-center justify-end mb-4">
                <a href="#" className="text-sm text-[#F4C430] hover:underline">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#F4C430] text-[#002147] font-medium hover:bg-[#E6B800] transition"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 008-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign up"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <div className="relative">
                <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 text-sm text-gray-400">or</span>
                <div className="h-px bg-gray-100"></div>
              </div>

              <div className="mt-4 flex gap-3 justify-center">
                <button className=" hover:bg-gray-50 transition"
                  ref={googleBtnRef}
                />
                <button className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-50 transition">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-7 17l7 5 7-5a10 10 0 00-7-17z" /></svg>
                  Continue with GitHub
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center bg-gray-100 px-6 py-4 text-sm text-gray-600">
            Already have an account?{" "}
            <button
              className="text-[#002147] font-semibold hover:underline"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          </div>
          
          <Modal open={showLogin} onClose={() => setShowLogin(false)}>
            {/* Interactive Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-500/20 to-indigo-600/20 animate-pulse"></div>
              
              {/* Floating particles */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/10 animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 20 + 10}px`,
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${Math.random() * 3 + 2}s`
                  }}
                ></div>
              ))}
              
              {/* Interactive moving shapes */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-400/30 to-purple-500/30 rounded-full blur-xl animate-bounce-slow"></div>
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-blue-400/30 to-indigo-500/30 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-full blur-lg animate-spin-slow"></div>
            </div>
            
            {/* Modal Content with higher z-index */}
            <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-lg">
              <Login onSignupClick={() => setShowLogin(false)} />
            </div>
            
            {/* CSS Animations */}
            <style jsx>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
              }
              @keyframes float-slow {
                0%, 100% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(30px, -30px) scale(1.05); }
                66% { transform: translate(-20px, 20px) scale(0.95); }
              }
              @keyframes float-reverse {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                50% { transform: translate(-40px, -40px) rotate(180deg); }
              }
              @keyframes float-particle {
                0%, 100% { transform: translateY(0px) opacity(0.7); }
                50% { transform: translateY(-30px) opacity(1); }
              }
              @keyframes bounce-slow {
                0%, 100% { transform: translateY(0px) scale(1); }
                50% { transform: translateY(-10px) scale(1.1); }
              }
              @keyframes bounce-gentle {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
              }
              @keyframes spin-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes rotate-slow {
                from { transform: rotate(45deg); }
                to { transform: rotate(405deg); }
              }
              @keyframes pulse-slow {
                0%, 100% { opacity: 0.4; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.1); }
              }
              .animate-float {
                animation: float ease-in-out infinite;
              }
              .animate-float-slow {
                animation: float-slow 8s ease-in-out infinite;
              }
              .animate-float-reverse {
                animation: float-reverse 10s ease-in-out infinite;
              }
              .animate-float-particle {
                animation: float-particle ease-in-out infinite;
              }
              .animate-bounce-slow {
                animation: bounce-slow 3s ease-in-out infinite;
              }
              .animate-bounce-gentle {
                animation: bounce-gentle 4s ease-in-out infinite;
              }
              .animate-spin-slow {
                animation: spin-slow 8s linear infinite;
              }
              .animate-rotate-slow {
                animation: rotate-slow 12s linear infinite;
              }
              .animate-pulse-slow {
                animation: pulse-slow 6s ease-in-out infinite;
              }
            `}</style>
          </Modal>
        </div>
      </div>
    </div>
  );
}