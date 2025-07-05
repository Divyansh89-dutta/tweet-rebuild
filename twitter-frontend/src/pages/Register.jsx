import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      setMessage(`Registered as ${res.data.username}`);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0d0d0d] to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* background light effects */}
      <div className="absolute w-72 h-72 bg-sky-500/20 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-fuchsia-600/10 rounded-full blur-2xl bottom-10 right-10"></div>

      <div className="w-full max-w-md z-10  border border-gray-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm space-y-6">
        <div className="flex justify-center">
          <svg
            viewBox="0 0 24 24"
            className="h-10 w-10 text-sky-500"
            fill="currentColor"
          >
            <g>
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.732a4.695 4.695 0 002.048-2.593 9.33 9.33 0 01-2.965 1.13 4.657 4.657 0 00-7.926 4.245 13.21 13.21 0 01-9.59-4.86 4.633 4.633 0 001.444 6.198A4.63 4.63 0 012.8 9.71v.057a4.66 4.66 0 003.733 4.566c-.451.122-.93.187-1.423.187-.347 0-.684-.033-1.013-.097a4.672 4.672 0 004.35 3.23 9.355 9.355 0 01-5.785 1.996c-.377 0-.748-.022-1.115-.066a13.166 13.166 0 007.132 2.087c8.563 0 13.247-7.086 13.247-13.228 0-.202-.005-.405-.014-.605a9.409 9.409 0 002.3-2.388l.002-.003z" />
            </g>
          </svg>
        </div>

        <h2 className="text-white text-3xl font-bold text-center">
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {["name", "username", "email", "password"].map((field) => (
            <div key={field}>
              <label className="text-gray-400 text-sm capitalize">{field}</label>
              <input
                type={field === "email" ? "email" : field === "password" ? "password" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field}`}
                required
                className="w-full p-3 rounded-md  text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold transition shadow-md"
          >
            Sign Up
          </button>
        </form>

        {message && <p className="text-red-500 text-center">{message}</p>}

        <p className="text-gray-400 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
