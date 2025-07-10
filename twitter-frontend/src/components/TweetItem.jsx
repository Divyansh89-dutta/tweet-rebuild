import React, { useMemo, useState } from "react";
import API from "../api/axios";
import RetweetModal from "./RetweetModel";

function TweetItem({ tweet, onUpdate, onDelete }) {
  const [replyText, setReplyText] = useState("");
  const [showRetweetModal, setShowRetweetModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(tweet.content);
  const [isDeleting, setIsDeleting] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isOwner = tweet.user?._id === loggedInUser?._id;

  const isSaved = useMemo(() => {
    return (tweet.savedBy || []).some(
      (id) => id?.toString() === loggedInUser?._id?.toString()
    );
  }, [tweet.savedBy, loggedInUser?._id]);

  const handleLike = async () => {
    try {
      const res = await API.post(`/tweets/${tweet._id}/like`);
      onUpdate?.(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnlike = async () => {
    try {
      const res = await API.post(`/tweets/${tweet._id}/unlike`);
      onUpdate?.(res.data);
    } catch (err) {
      console.error(err);
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
      console.error(err);
    }
  };

  const handleRetweetSubmit = async (content) => {
    try {
      const res = await API.post(`/tweets/${tweet._id}/retweet`, { content });
      setShowRetweetModal(false);
      onUpdate?.(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await API.post(`/tweets/${tweet._id}/save`);
      onUpdate?.(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnsave = async () => {
    try {
      const res = await API.post(`/tweets/${tweet._id}/unsave`);
      onUpdate?.(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    // Optimistically remove tweet from UI
    onDelete?.(tweet._id);

    try {
      await API.delete(`/tweets/${tweet._id}`);
    } catch (err) {
      alert("Delete failed! Reloading timeline.");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    try {
      const res = await API.put(`/tweets/${tweet._id}`, {
        content: editedContent,
      });
      onUpdate?.(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const isRetweet = tweet.parent && tweet.parent.user;

  return (
  <div
    className={`border rounded-lg p-4 mb-4 bg-white shadow-sm ${
      isRetweet ? "ml-8 bg-gray-50" : ""
    } ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
  >
    {isRetweet && (
      <div className="border p-2 bg-gray-100 mb-2 rounded text-sm">
        <strong>
          @{tweet.parent.user?.username} ({tweet.parent.user?.name})
        </strong>
        <div>{tweet.parent.content}</div>
      </div>
    )}

    <div className="font-semibold">@{tweet.user?.username} ({tweet.user?.name})</div>

    {editing ? (
      <div className="space-y-2 mt-2">
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full border rounded p-2"
        />
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <div className="mt-2">{tweet.content}</div>
    )}

    {tweet.media && (
      <img
        src={tweet.media}
        alt="media"
        className="mt-2 max-w-xs rounded"
      />
    )}

    <div className="text-gray-500 text-xs mt-1">
      {tweet.createdAt ? new Date(tweet.createdAt).toLocaleString() : "Invalid Date"}
    </div>

    <div className="flex flex-wrap items-center gap-2 mt-3 text-sm">
      <button onClick={handleLike} className="text-blue-500 hover:underline">Like</button>
      <button onClick={handleUnlike} className="text-blue-500 hover:underline">Unlike</button>
      {!isRetweet && (
        <button onClick={() => setShowRetweetModal(true)} className="text-blue-500 hover:underline">Retweet</button>
      )}
      <button onClick={isSaved ? handleUnsave : handleSave} className="text-blue-500 hover:underline">
        {isSaved ? "Unsave" : "Save"}
      </button>
      {isOwner && (
        <>
          <button onClick={() => setEditing(true)} className="text-blue-500 hover:underline">Edit</button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:underline"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </>
      )}
      <span className="text-gray-600 ml-auto">Likes: {tweet.likes?.length || 0}</span>
    </div>

    <form onSubmit={handleReply} className="mt-3 flex items-center gap-2">
      <input
        type="text"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Reply..."
        className="flex-grow border rounded p-1 px-2"
      />
      <button
        type="submit"
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reply
      </button>
    </form>

    {tweet.replies?.length > 0 && !tweet.parent?.parent && (
      <div className="mt-4 border-l-2 border-gray-300 pl-4">
        <strong className="text-sm">Replies:</strong>
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
