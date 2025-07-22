import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import API from "../api/axios";
import MyTweetsPage from "../components/MyTweetsPage";
import SavedTweetsPage from "../components/SavedTweetsPage";
import Navbar from "../components/Navbar";

function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("tweets");

  useEffect(() => {
    if (!user || !user.token) {
      window.location.href = "/login";
    }
  });
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users/profile");
      setProfile(res.data);
      setEditData({
        name: res.data.name || "",
        bio: res.data.bio || "",
        location: res.data.location || "",
        website: res.data.website || "",
      });
      setAvatarPreview(res.data.avatar || "");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("bio", editData.bio);
      formData.append("location", editData.location);
      formData.append("website", editData.website);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await API.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditing(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black  via-[#0f172a] to-[#1e293b] text-white px-4 pt-3">
      <div className="absolute top-0 left-0 w-60 h-60 bg-blue-500 opacity-20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-fuchsia-600 opacity-10 blur-3xl rounded-full" />
      <Navbar user={user} />

      {profile && (
        <div className="max-w-2xl mx-auto bg-[#142624B] p-6 rounded-xl border border-gray-700">
          <div className="text-center mb-6">
            {editing ? (
              <>
                <label className="block mt-4 text-gray-300">
                  Avatar:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block mt-2 text-gray-400"
                  />
                </label>

                <input
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  placeholder="Name"
                  className="w-full mt-2 p-2 rounded text-white"
                />
                <input
                  name="bio"
                  value={editData.bio}
                  onChange={handleEditChange}
                  placeholder="Bio"
                  className="w-full mt-2 p-2 rounded text-white"
                />
                <input
                  name="location"
                  value={editData.location}
                  onChange={handleEditChange}
                  placeholder="Location"
                  className="w-full mt-2 p-2 rounded text-white"
                />
                <input
                  name="website"
                  value={editData.website}
                  onChange={handleEditChange}
                  placeholder="Website"
                  className="w-full mt-2 p-2 rounded text-white"
                />

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-sky-500 p-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 bg-blue-500 p-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center ">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="avatar"
                      className="w-20 h-20 rounded-full mx-auto object-cover border border-gray-700"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-700 mx-auto flex items-center justify-center text-4xl">
                      ?
                    </div>
                  )}
                  <div className="text-start">
                    <p className="text-[18px] font-semibole">{profile.name}</p>
                    <p className="text-gray-400 text-[15px]">
                      @{profile.username}
                    </p>
                    <p className="text-[14px]">{profile.bio}</p>
                    <p className="text-[14px] text-gray-400">
                      {profile.location}
                    </p>
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-400 text-[15px] hover:underline"
                      >
                        {profile.website}
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="block px-2 mt-23 font-semibold py-1 text-[12px] bg-sky-600 rounded-xl"
                  >
                    Edit
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setActiveTab("tweets")}
              className={`${
                activeTab === "tweets"
                  ? "border-b-2 border-sky-500 text-sky-400"
                  : "text-gray-400"
              } pb-1`}
            >
              My Tweets
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`${
                activeTab === "saved"
                  ? "border-b-2 border-sky-500 text-sky-400"
                  : "text-gray-400"
              } pb-1`}
            >
              Saved Tweets
            </button>
          </div>

          {activeTab === "tweets" ? (
            <MyTweetsPage tweets={profile.tweets} />
          ) : (
            <SavedTweetsPage savedTweets={profile.savedTweets} />
          )}

          <button
            onClick={logout}
            className="mt-3 w-full py-2 bg-red-600 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
