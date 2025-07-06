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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md text-white p-8 rounded-2xl shadow-2xl border border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 rounded-bl-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-fuchsia-600 rounded-full blur-3xl opacity-20"></div>

        <div className="text-center mb-8">
          <svg viewBox="0 0 24 24" className="w-10 h-10 mx-auto fill-white mb-4">
            <g>
              <path d="M22.46 6c-.77.35-1.6.59-2.46.69a4.26 4.26 0 001.88-2.36c-.83.5-1.75.85-2.73 1.05a4.25 4.25 0 00-7.24 3.87A12.06 12.06 0 013 4.74a4.26 4.26 0 001.32 5.68 4.2 4.2 0 01-1.92-.53v.05a4.25 4.25 0 003.42 4.17 4.27 4.27 0 01-1.91.07 4.25 4.25 0 003.97 2.96A8.53 8.53 0 013 18.57a12.02 12.02 0 006.52 1.91c7.84 0 12.13-6.5 12.13-12.13 0-.18-.01-.36-.02-.54A8.67 8.67 0 0024 5.1a8.46 8.46 0 01-2.54.7z"></path>
            </g>
          </svg>
          <h2 className="text-3xl font-bold tracking-tight">Sign in to X</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition font-semibold text-white text-lg shadow-md"
          >
            Log in
          </button>
        </form>

        {message && (
          <p className="text-red-500 text-sm mt-4 text-center">{message}</p>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
