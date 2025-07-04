import React, { useState } from "react";
import API from "../api/axios";

function TweetItem({ tweet, onUpdate }) {
  const [replyText, setReplyText] = useState("");

  const handleLike = async () => {
    const res = await API.post(`/tweets/${tweet._id}/like`);
    onUpdate?.(res.data);
  };

  const handleUnlike = async () => {
    const res = await API.post(`/tweets/${tweet._id}/unlike`);
    onUpdate?.(res.data);
  };

  const handleRetweet = async () => {
    const res = await API.post(`/tweets/${tweet._id}/retweet`);
    onUpdate?.(res.data);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const res = await API.post(`/tweets/${tweet._id}/reply`, { content: replyText });
    setReplyText("");
    onUpdate?.(res.data, "reply");
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        marginBottom: "10px",
        marginLeft: tweet.parent ? "20px" : "0",
        backgroundColor: tweet.parent ? "#f9f9f9" : "#fff",
      }}
    >
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
        {new Date(tweet.createdAt).toLocaleString()}
      </div>

      {/* Actions */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleLike}>Like</button>
        <button onClick={handleUnlike} style={{ marginLeft: "8px" }}>
          Unlike
        </button>
        <button onClick={handleRetweet} style={{ marginLeft: "8px" }}>
          Retweet
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
      {tweet.replies?.length > 0 && (
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
                if (type === "reply") {
                  const updatedReplies = [...(tweet.replies || []), updatedReply];
                  onUpdate?.({ ...tweet, replies: updatedReplies });
                } else {
                  const index = tweet.replies.findIndex(
                    (r) => r._id === updatedReply._id
                  );
                  if (index !== -1) {
                    const updatedReplies = [
                      ...tweet.replies.slice(0, index),
                      updatedReply,
                      ...tweet.replies.slice(index + 1),
                    ];
                    onUpdate?.({ ...tweet, replies: updatedReplies });
                  }
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TweetItem;
