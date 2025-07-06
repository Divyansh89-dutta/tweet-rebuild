import React, { useState } from "react";
import API from "../api/axios";
import { ImageIcon } from "lucide-react";

function TweetCard({ onTweetPosted }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
      setMessage("Tweet posted!");
      setText("");
      setFile(null);
      onTweetPosted?.();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error posting Tweet");
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-4 shadow-md text-gray-100 space-y-4">
      <h2 className="text-lg font-semibold">Post a Tweet</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          className="w-full p-3 rounded-xl bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        ></textarea>

        <div className="flex items-center justify-between">
          <label className="cursor-pointer flex items-center gap-2 text-blue-400 hover:text-blue-300">
            <ImageIcon className="w-5 h-5" />
            <span className="text-sm">Add image</span>
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow"
          >
            Tweet
          </button>
        </div>
      </form>

      {message && (
        <p
          className={`text-sm ${
            message.includes("Error") ? "text-red-400" : "text-green-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default TweetCard;
