import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import Login from "./Login";
import axios from "axios";

// 3D background imports
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Stars } from "@react-three/drei";

// Animated 3D background component
function AnimatedBackground() {
  // Track hovered/clicked cube index
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [clickedIdx, setClickedIdx] = useState(null);

  // Animate cubes in a grid
  const cubes = [];
  let idx = 0;
  for (let x = -3; x <= 3; x += 2) {
    for (let y = -2; y <= 2; y += 2) {
      cubes.push(
        <Float key={`${x}-${y}`} speed={1.5 + Math.abs(x + y) * 0.2} rotationIntensity={1.2} floatIntensity={1.2}>
          <mesh
            position={[x, y, -2]}
            scale={
              clickedIdx === idx
                ? 1.3
                : hoveredIdx === idx
                ? 1.1
                : 1
            }
            onPointerOver={() => setHoveredIdx(idx)}
            onPointerOut={() => setHoveredIdx(null)}
            onClick={() => setClickedIdx(clickedIdx === idx ? null : idx)}
            style={{ cursor: hoveredIdx === idx ? "pointer" : "auto" }}
          >
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial
              color={
                clickedIdx === idx
                  ? "#f472b6" // pink
                  : hoveredIdx === idx
                  ? "#14b8a6" // teal
                  : "#222"    // black cubes
              }
              metalness={0.7}
              roughness={0.3}
              opacity={0.95}
              transparent
              emissive={hoveredIdx === idx ? "#6366f1" : "#111"}
              emissiveIntensity={hoveredIdx === idx ? 0.8 : 0.3}
            />
          </mesh>
        </Float>
      );
      idx++;
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "auto",
        background: "#000", // black background
      }}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 65 }}>
        <ambientLight intensity={0.7} color="#222" />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#6366f1" />
        {/* Wireframe grid */}
        <mesh position={[0, 0, -3]}>
          <planeGeometry args={[12, 8, 12, 8]} />
          <meshBasicMaterial color="#333" wireframe opacity={0.3} transparent />
        </mesh>
        {/* Interactive cubes */}
        {cubes}
        {/* More visible stars */}
        <Stars
          radius={30}
          depth={80}
          count={2000}
          factor={4}
          saturation={0.5}
          fade
          speed={2}
        />
        {/* Planet with ring */}
        <Float speed={1.2} rotationIntensity={1.2} floatIntensity={1.2}>
          <mesh position={[3, 2, -1]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#6366f1" metalness={0.8} roughness={0.2} emissive="#6366f1" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[3, 2, -1]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.2, 0.08, 16, 100]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.3} emissive="#fbbf24" emissiveIntensity={0.3} transparent opacity={0.7} />
          </mesh>
        </Float>
        {/* Big glowing star */}
        <Float speed={0.8} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[-4, 3, -2]}>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial
              color="#fffde4"
              emissive="#fffde4"
              emissiveIntensity={2.5}
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.95}
            />
          </mesh>
        </Float>
        <OrbitControls enableZoom={true} enablePan={true} autoRotate autoRotateSpeed={1.2} />
      </Canvas>
    </div>
  );
}

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
      const res = await axios.post("http://localhost:5001/user/signup", {
        username: data.username,
        email: data.email,
        password: data.password,
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
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
      const res = await axios.post("http://localhost:5001/user/google-signup", {
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
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: "YOUR_GOOGLE_CLIENT_ID",
          callback: handleGoogleSignup,
        });
        window.google.accounts.id.renderButton(
          googleBtnRef.current,
          { theme: "outline", size: "large", text: "signup_with" }
        );
      };
      document.body.appendChild(script);
    } else {
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: handleGoogleSignup,
      });
      window.google.accounts.id.renderButton(
        googleBtnRef.current,
        { theme: "outline", size: "large", text: "signup_with" }
      );
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState({ type: "", message: "" });

  return (
    
    <div className="min-h-screen  flex items-center justify-center bg-gradient-to-b 0 py-12 px-4 relative overflow-hidden">
      {/* 3D Animated Background */}
      <AnimatedBackground />
      
      <div className="w-full max-w-md  relative z-10">
        <div className="bg-white shadow-lg  rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-400">
                {/* simple inline logo */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="22" height="22" rx="5" fill="rgba(255,255,255,0.12)" />
                  <path d="M6 16V8h3.2l2.8 4.5L15.8 8H19v8h-2.2v-4.5L14 13.5 11.2 11V16H6z" fill="white" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Sign in to Naagrik</h1>
                <p className="text-sm text-gray-500">Report issues and track resolutions</p>
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
                  className="mt-1 block w-full rounded-md border-gray-200 border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="Eneter your username"
                  {...register("username", { required: true })} />
                {errors.username && <span className='text-sm text-red-500'>This field is required</span>}
              </label>

              <label className="block mb-3">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-200 border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="you@example.com"
                  {...register("email", { required: true })} />
                {errors.email && <span className='text-sm text-red-500'>This field is required</span>}
              </label>


              <label className="block mb-3 relative">
                <span className="text-sm font-medium text-gray-700">Password</span>
                <div className="mt-1 relative">
                  <input
                    type="password"
                    className="block w-full rounded-md border-gray-200 border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="Enter your password"
                    {...register("password", { required: true })} />
                  {errors.password && <span className='text-sm text-red-500'>This field is required</span>}
                </div>
              </label>

              <div className="flex items-center justify-end mb-4">
                <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-medium hover:opacity-95 transition"
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

          <div className="mt-4 text-center bg-gray-50 px-6 py-4 text-sm text-gray-600">
            Already have an account?{" "}
            <button
              className="text-indigo-600 hover:underline"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          </div>
          <Modal open={showLogin} onClose={() => setShowLogin(false)}>
            {/* Animated background for Login modal */}
            {showLogin && (
              <div style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none"
              }}>
                <AnimatedBackground />
              </div>
            )}
            {/* Login form content */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <Login onSignupClick={() => setShowLogin(false)} />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}