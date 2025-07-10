import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  

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
          <div className="text-center">
          <div className="text-white text-5xl font-black tracking-tight">𝕏</div>
        </div>
        </div>

        <h2 className="text-white text-4xl text-center">
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
                className="w-full p-3 rounded-md  text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-3 focus:ring-cyan-500 focus:border-cyan-400 transition"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all font-bold text-white text-lg shadow-md shadow-blue-900"
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
