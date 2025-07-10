import React, { useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("auth/login", { email, password });
      const userData = { ...res.data.user, token: res.data.token };
      login(userData);
      navigate("/home");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Neon background blur */}
      <div className="absolute top-0 left-0 w-60 h-60 bg-blue-500 opacity-30 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-fuchsia-600 opacity-30 blur-3xl rounded-full" />
      <div className="w-full max-w-md text-white  backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-white text-5xl font-black mb-3 tracking-tight">𝕏</div>
          <h2 className="text-2xl font-semibold text-gray-100">Welcome back</h2>
          <p className="text-sm text-gray-400">Sign in to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-zinc-700 placeholder-gray-500 text-white focus:outline-none focus:ring-[2px] focus:ring-cyan-500 focus:border-cyan-400 transition"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl  border border-zinc-700 placeholder-gray-500 text-white focus:outline-none focus:ring-[2px] focus:ring-purple-500 focus:border-purple-400 transition"
              placeholder="*********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all font-bold text-white text-lg shadow-md shadow-blue-900"
          >
            Sign in
          </button>

          {message && (
            <p className="text-red-500 text-sm text-center">{message}</p>
          )}
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <a href="/register" className="text-cyan-400 hover:underline font-medium">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
