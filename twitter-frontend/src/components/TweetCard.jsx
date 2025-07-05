import API from "../api/axios";
import React from "react";
import { useState } from "react";

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
      await API.post('/tweets', formData, {
        headers:{
          "Content-Type": "multipart/form-data",
        },
      })
      setMessage("Tweet posted!");
      setText("");
      setFile(null);
      onTweetPosted?.();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error posting Tweet");
    }
  };
  return (
    <div>
      <h2>Post a tweet</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
        />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Tweet</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default TweetCard;
