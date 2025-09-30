import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api"; // axios instance

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await API.post("/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin"); // redirect after login
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <form 
        onSubmit={handleSubmit} 
        className="bg-white w-full max-w-sm p-8 md:p-10 rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 transform hover:shadow-3xl"
    >
        <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Admin Portal Login 🔐
            </h2>
            <p className="text-sm text-gray-500 mt-1">Access your management dashboard.</p>
        </div>

        {/* Dynamic Message Area */}
        {msg && (
            <p className="text-center text-sm font-medium p-3 mb-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
                {msg}
            </p>
        )}

        {/* Email Input */}
        <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
            </label>
            <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="border border-gray-300 p-3 w-full rounded-lg shadow-sm placeholder-gray-400 
                           focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
        </div>

        {/* Password Input */}
        <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
            </label>
            <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="border border-gray-300 p-3 w-full rounded-lg shadow-sm placeholder-gray-400 
                           focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {/* Optional: Forgot Password Link */}
            <div className="text-right mt-1">
                <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">
                    Forgot Password?
                </a>
            </div>
        </div>

        {/* Submit Button */}
        <button
            type="submit"
            className="bg-blue-600 text-white font-semibold tracking-wide uppercase py-3 rounded-lg w-full shadow-lg transition duration-200 
                       hover:bg-blue-700 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        >
            Secure Login
        </button>
    </form>
</div>
  );
}
