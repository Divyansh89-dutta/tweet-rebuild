import React, { useState } from "react";
import { FiImage } from "react-icons/fi";
import API from "../api/axios";

function TweetCard({ onTweetPosted }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", text);
    if (file) {
      formData.append("media", file);
    }

    try {
      await API.post("/tweets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("✅ Tweet posted!");
      setText("");
      setFile(null);
      onTweetPosted?.();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Error posting Tweet");
    }
  };

  return (
    <div className="bg-black border border-gray-700 rounded-xl p-4 shadow-md text-white max-w-xl w-full mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          rows={3}
          className="w-full bg-transparent text-white placeholder-gray-500 border border-gray-700 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {file && (
          <div className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="rounded-lg max-h-64 object-cover border border-gray-700"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          {/* Icon-based file input */}
          <div className="flex items-center space-x-3">
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-gray-800 transition"
            >
              <FiImage size={22} className="text-blue-400" />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded-full transition"
          >
          Post
          </button>
        </div>

        {message && (
          <p
            className={`text-sm ${
              message.includes("✅") ? "text-green-400" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default TweetCard;
