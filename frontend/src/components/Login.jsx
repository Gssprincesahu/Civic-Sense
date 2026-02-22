import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";

export default function Login(props) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState({ type: "", message: "" });

  const onSubmit = async (data) => {
    setLoading(true);
    setFlash({ type: "", message: "" });
    const userinfo = {
      email: data.email,
      password: data.password,
    };
    try {
      const res = await axios.post("http://localhost:5001/api/user/Login", userinfo, {
        withCredentials: true
      });
      if (res.data) {
        setFlash({ type: "success", message: "Login successful!" });
        localStorage.setItem("Users", JSON.stringify(res.data.user));
        login(res.data.user); // Update auth context
        setTimeout(() => navigate('/'), 1000); // Redirect after 1 second
      }
    } catch (err) {
      if (err.response) {
        setFlash({ type: "error", message: err.response.data.message });
      } else {
        setFlash({ type: "error", message: "Server not responding" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#002147] py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 shadow-lg rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F4C430]">
                {/* inline logo */}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1"
                    y="1"
                    width="22"
                    height="22"
                    rx="5"
                    fill="rgba(0,33,71,0.2)"
                  />
                  <path
                    d="M6 16V8h3.2l2.8 4.5L15.8 8H19v8h-2.2v-4.5L14 13.5 11.2 11V16H6z"
                    fill="#002147"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[#002147]">
                  Login to Naagrik
                </h1>
                <p className="text-sm text-gray-600">
                  Access your account to report and track issues
                </p>
              </div>
            </div>

            {flash.message && (
              <div
                className={`mb-4 text-sm px-3 py-2 rounded-md ${flash.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                  }`}
                role="status"
              >
                {flash.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <label className="block mb-3">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  className="mt-1 block w-full rounded-md border-gray-200 border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F4C430]"
                  placeholder="you@example.com"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-sm text-red-500">
                    Email is required
                  </span>
                )}
              </label>

              {/* Password */}
              <label className="block mb-3 relative">
                <span className="text-sm font-medium text-gray-700">
                  Password
                </span>
                <div className="mt-1 relative">
                  <input
                    type="password"
                    autoComplete="current-password"
                    className="block w-full rounded-md border-gray-200 border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#F4C430]"
                    placeholder="Enter your password"
                    {...register("password", { required: true })}
                  />
                  {errors.password && (
                    <span className="text-sm text-red-500">
                      Password is required
                    </span>
                  )}
                </div>
              </label>

              <div className="flex items-center justify-end mb-4">
                <a
                  href="#"
                  className="text-sm text-[#F4C430] hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#F4C430] text-[#002147] font-medium hover:bg-[#E6B800] transition"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <div className="relative">
                <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 text-sm text-gray-400">
                  or
                </span>
                <div className="h-px bg-gray-100"></div>
              </div>

              <div className="mt-4 flex gap-3 justify-center">
                <button className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-50 transition">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a10 10 0 0016.18 8.33l3.4 1.07A1 1 0 0023 20.6l-1-1.6A9.95 9.95 0 0022 12z" />
                  </svg>
                  Google
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-50 transition">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2a10 10 0 00-7 17l7 5 7-5a10 10 0 00-7-17z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 px-6 py-4 text-center text-sm text-gray-600">
            New here?{" "}
            <button
              type="button"
              className="text-[#002147] font-semibold hover:underline"
              onClick={props.onSignupClick}
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
