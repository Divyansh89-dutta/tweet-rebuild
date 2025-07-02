import axios from "axios";
import React from "react";
import { useState } from "react";

function TweetCard() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text".text);
    if (file) {
      formData.append("media", file);
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/tweets", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Tweet posted!");
      setText("");
      setFile(null);
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
      {message & <p>{message}</p>}
    </div>
  );
}

export default TweetCard;
