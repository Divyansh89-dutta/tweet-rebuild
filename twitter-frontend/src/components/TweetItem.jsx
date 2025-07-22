import React, { useMemo, useState } from "react";
import API from "../api/axios";
import RetweetModal from "./RetweetModel";
import TweetContent from "./TweetContent";
import TweetActions from "./TweetActions";
import ReplyBox from "./ReplyBox";
import TweetReplies from "./TweetReplies";

function TweetItem({ tweet, onUpdate, onDelete }) {
  const [replyText, setReplyText] = useState("");
  const [showRetweetModal, setShowRetweetModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(tweet.content);
  const [isDeleting, setIsDeleting] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isOwner = tweet.user?._id === loggedInUser?._id;

  const isSaved = useMemo(() => {
    return (tweet.savedBy || []).some(id => id?.toString() === loggedInUser?._id?.toString());
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
      const res = await API.post(`/tweets/${tweet._id}/reply`, { content: replyText });
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
    onDelete?.(tweet._id); // optimistic delete
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
      const res = await API.put(`/tweets/${tweet._id}`, { content: editedContent });
      onUpdate?.(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const isRetweet = tweet.parent && tweet.parent.user;

  return (
    <div
      className={`bg-[#0f172a] border border-gray-700 rounded-xl mt-4 p-4 shadow-md ${isRetweet ? "bg-[#0f172a] border border-gray-700 rounded-xl p-4 shadow-md" : ""} ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      <TweetContent
        tweet={tweet}
        editing={editing}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        handleEdit={handleEdit}
        setEditing={setEditing}
      />

      <TweetActions
        tweet={tweet}
        isSaved={isSaved}
        isOwner={isOwner}
        isDeleting={isDeleting}
        handleLike={handleLike}
        handleUnlike={handleUnlike}
        setShowRetweetModal={setShowRetweetModal}
        handleSave={handleSave}
        handleUnsave={handleUnsave}
        setEditing={setEditing}
        handleDelete={handleDelete}
      />

      <ReplyBox
        replyText={replyText}
        setReplyText={setReplyText}
        handleReply={handleReply}
      />

      <TweetReplies tweet={tweet} onUpdate={onUpdate} />

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
