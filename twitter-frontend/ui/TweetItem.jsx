import React, { useState } from "react";
import API from "../api/axios";
import RetweetModal from "./RetweetModel";
import { Heart, Repeat2 } from "lucide-react";
import { motion } from "framer-motion";

function TweetItem({ tweet, onUpdate }) {
  const [replyText, setReplyText] = useState("");
  const [showRetweetModal, setShowRetweetModal] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);

  const handleLike = async () => {
    if (!tweet?._id) return alert("Tweet ID is missing");
    try {
      setLikeAnimating(true);
      const res = await API.post(`/tweets/${tweet._id}/like`);
      onUpdate?.(res.data);
      setTimeout(() => setLikeAnimating(false), 300); // reset animation
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleUnlike = async () => {
    if (!tweet?._id) return alert("Tweet ID is missing");
    try {
      setLikeAnimating(true);
      const res = await API.post(`/tweets/${tweet._id}/unlike`);
      onUpdate?.(res.data);
      setTimeout(() => setLikeAnimating(false), 300); // reset animation
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

  const isRetweet = tweet.parent && tweet.parent.user;

  return (
    <div
      className={`bg-gray-800 rounded-xl p-4 mb-4 shadow-sm ${
        isRetweet ? "ml-6 border-l-4 border-blue-500" : ""
      }`}
    >
      {isRetweet && (
        <div className="bg-gray-700 p-3 rounded-lg mb-3 text-sm text-gray-300">
          <p className="font-semibold text-blue-400">
            @{tweet.parent.user?.username} ({tweet.parent.user?.name})
          </p>
          <p>{tweet.parent.content}</p>
        </div>
      )}

      <div className="text-gray-200 font-semibold mb-1">
        @{tweet.user?.username}{" "}
        <span className="text-gray-400 font-normal">
          ({tweet.user?.name})
        </span>
      </div>

      <p className="text-gray-100 mb-2">{tweet.content}</p>

      {tweet.media && (
        <img
          src={tweet.media}
          alt="tweet media"
          className="w-full max-w-sm rounded-md mt-2 mb-2"
        />
      )}

      <div className="text-xs text-gray-400">
        {tweet.createdAt
          ? new Date(tweet.createdAt).toLocaleString()
          : "Invalid Date"}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 text-sm mt-3">
        <motion.button
          onClick={handleLike}
          className="flex items-center text-gray-300 hover:text-red-400"
          animate={likeAnimating ? { scale: 1.3 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <Heart className="w-4 h-4 mr-1" />
          <span>Like</span>
          <span className="ml-2 text-gray-400">
            ({tweet.likes?.length || 0})
          </span>
        </motion.button>

        <motion.button
          onClick={handleUnlike}
          className="text-gray-300 hover:text-yellow-400"
          animate={likeAnimating ? { scale: 1.2 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          Unlike
        </motion.button>

        {!isRetweet && (
          <button
            onClick={() => setShowRetweetModal(true)}
            className="flex items-center text-gray-300 hover:text-green-400"
          >
            <Repeat2 className="w-4 h-4 mr-1" />
            Retweet
          </button>
        )}
      </div>

      {/* Reply Input */}
      <form onSubmit={handleReply} className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="flex-grow bg-gray-700 text-sm text-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Reply
        </button>
      </form>

      {/* Replies */}
      {tweet.replies?.length > 0 && !tweet.parent?.parent && (
        <div className="mt-4 border-l-2 border-gray-600 pl-4 space-y-4">
          <p className="text-gray-400 text-sm font-semibold">Replies:</p>
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

      {/* Retweet Modal */}
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
