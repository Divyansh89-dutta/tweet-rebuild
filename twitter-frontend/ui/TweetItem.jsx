import React, { useState } from "react";
import API from "../api/axios";
import RetweetModal from "./RetweetModel";

function TweetItem({ tweet, onUpdate }) {
  const [replyText, setReplyText] = useState("");
  const [showRetweetModal, setShowRetweetModal] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const isSaved = tweet.savedBy?.includes(loggedInUser?._id);

  const handleLike = async () => {
    if (!tweet?._id) return alert("Tweet ID is missing");
    try {
      const res = await API.post(`/tweets/${tweet._id}/like`);
      onUpdate?.(res.data);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleUnlike = async () => {
    if (!tweet?._id) return alert("Tweet ID is missing");
    try {
      const res = await API.post(`/tweets/${tweet._id}/unlike`);
      onUpdate?.(res.data);
    } catch (err) {
      console.error("Unlike error:", err);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      const res = await API.post(`/tweets/${tweet._id}/reply`, {
        content: replyText,
      });
      setReplyText("");
      onUpdate?.(res.data, "reply");
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  const handleRetweetSubmit = async (content) => {
    if (!tweet?._id) return alert("Tweet ID is missing");
    try {
      const res = await API.post(`/tweets/${tweet._id}/retweet`, { content });
      setShowRetweetModal(false);
      onUpdate?.(res.data);
    } catch (err) {
      console.error("Retweet error:", err);
    }
  };

  const handleSave = async () => {
    if (!tweet?._id) return alert("Tweet ID is missing");
    try {
      const res = await API.post(`/tweets/${tweet._id}/save`);
      onUpdate?.(res.data);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleUnsave = async () => {
    if (!tweet?._id) return alert("Tweet ID is missing");
    try {
      const res = await API.post(`/tweets/${tweet._id}/unsave`);
      onUpdate?.(res.data);
    } catch (err) {
      console.error("Unsave error:", err);
    }
  };

  const isRetweet = tweet.parent && tweet.parent.user;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        marginBottom: "10px",
        marginLeft: isRetweet ? "20px" : "0",
        backgroundColor: isRetweet ? "#f9f9f9" : "#fff",
      }}
    >
      {/* Parent Tweet Display (for quote retweets) */}
      {isRetweet && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "8px",
            backgroundColor: "#f0f0f0",
            marginBottom: "10px",
          }}
        >
          <strong>
            @{tweet.parent.user?.username} ({tweet.parent.user?.name})
          </strong>
          <div>{tweet.parent.content}</div>
        </div>
      )}

      {/* Tweet Content */}
      <div style={{ fontWeight: "bold" }}>
        @{tweet.user?.username} ({tweet.user?.name})
      </div>
      <div>{tweet.content}</div>

      {tweet.media && (
        <img
          src={tweet.media}
          alt="tweet media"
          style={{ maxWidth: "300px", marginTop: "10px" }}
        />
      )}

      <div style={{ fontSize: "0.8em", color: "#666" }}>
        {tweet.createdAt
          ? new Date(tweet.createdAt).toLocaleString()
          : "Invalid Date"}
      </div>

      {/* Actions */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleLike}>Like</button>
        <button onClick={handleUnlike} style={{ marginLeft: "8px" }}>
          Unlike
        </button>
        {!isRetweet && (
          <button
            onClick={() => setShowRetweetModal(true)}
            style={{ marginLeft: "8px" }}
          >
            Retweet
          </button>
        )}
        <button
          onClick={isSaved ? handleUnsave : handleSave}
          style={{ marginLeft: "8px" }}
        >
          {isSaved ? "Unsave" : "Save"}
        </button>
        <span style={{ marginLeft: "10px" }}>
          Likes: {tweet.likes?.length || 0}
        </span>
      </div>

      {/* Reply Form */}
      <form onSubmit={handleReply} style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          style={{ width: "60%", marginRight: "8px" }}
        />
        <button type="submit">Reply</button>
      </form>

      {/* Replies */}
      {tweet.replies?.length > 0 && !tweet.parent?.parent && (
        <div
          style={{
            marginTop: "10px",
            borderLeft: "2px solid #ddd",
            paddingLeft: "10px",
          }}
        >
          <strong>Replies:</strong>
          {tweet.replies.map((reply) => (
            <TweetItem
              key={reply._id}
              tweet={reply}
              onUpdate={(updatedReply, type) => {
                if (!updatedReply?._id) return;

                if (type === "reply") {
                  const updatedReplies = [...(tweet.replies || []), updatedReply];
                  onUpdate?.({ ...tweet, replies: updatedReplies });
                } else {
                  const updatedReplies = (tweet.replies || []).map((r) =>
                    r._id === updatedReply._id ? updatedReply : r
                  );
                  onUpdate?.({ ...tweet, replies: updatedReplies });
                }
              }}
            />
          ))}
        </div>
      )}

      {showRetweetModal && (
        <RetweetModal
          tweet={tweet}
          onClose={() => setShowRetweetModal(false)}
          onSubmit={handleRetweetSubmit}
        />
      )}
    </div>
  );
}

export default TweetItem;
