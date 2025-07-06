import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/axios';

function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/users/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to fetch profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 pt-12">
      {/* Nav */}
      <nav className="mb-8 text-sm space-x-4">
        <Link to="/home" className="text-sky-400 hover:underline">Home</Link>
        <span className="text-gray-500">|</span>
        <Link to="/profile" className="text-sky-400 hover:underline">Profile</Link>
      </nav>

      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {profile && (
        <div className="w-full max-w-md bg-[#16181C] p-6 rounded-2xl shadow-lg border border-gray-800 space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="avatar"
                className="w-28 h-28 rounded-full object-cover border border-gray-700"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center text-4xl text-gray-300 font-bold">
                ?
              </div>
            )}
          </div>

          {/* Details */}
          <div className="text-center space-y-2">
            <p className="text-xl font-semibold">{profile.name || "Unnamed"}</p>
            <p className="text-sm text-gray-400">@{profile.username}</p>
            <p className="text-sm text-gray-300">{profile.email}</p>
            <p className="text-sm italic text-gray-400">{profile.bio || "No bio yet."}</p>
          </div>

          {/* Stats */}
          <div className="flex justify-around text-sm mt-4 text-center">
            <div>
              <p className="font-bold">{profile.followers?.length || 0}</p>
              <p className="text-gray-400">Followers</p>
            </div>
            <div>
              <p className="font-bold">{profile.following?.length || 0}</p>
              <p className="text-gray-400">Following</p>
            </div>
          </div>

          {/* Joined Date */}
          <p className="text-xs text-center text-gray-500 mt-2">
            Joined: {new Date(profile.createdAt).toLocaleDateString()}
          </p>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full mt-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
