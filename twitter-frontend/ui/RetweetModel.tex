import React, { useState } from "react";

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  padding: "20px",
  zIndex: 1000,
  width: "400px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.3)",
  zIndex: 999,
};

function RetweetModal({ tweet, onClose, onSubmit }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(content);
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose}></div>
      <div style={modalStyle}>
        <h3>Retweet with comment</h3>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            backgroundColor: "#f0f0f0",
            marginBottom: "10px",
          }}
        >
          <strong>
            @{tweet.user?.username} ({tweet.user?.name})
          </strong>
          <p>{tweet.content}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Add your comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: "100%", height: "60px", marginBottom: "10px" }}
          />
          <div style={{ textAlign: "right" }}>
            <button type="button" onClick={onClose} style={{ marginRight: "10px" }}>
              Cancel
            </button>
            <button type="submit">Retweet</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default RetweetModal;
