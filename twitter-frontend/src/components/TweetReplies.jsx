import React from "react";
import TweetItem from "./TweetItem";

const TweetReplies = ({ tweet, onUpdate }) => {
  if (!tweet.replies?.length || tweet.parent?.parent) return null;

  return (
    <div className="mt-4 border-l-2 border-gray-300 pl-4">
      <strong className="text-sm">Replies:</strong>
      {tweet.replies.map((reply, index) => (
        <TweetItem
          key={reply._id || `reply-${index}`} // ✅ fallback key
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
  );
};

export default TweetReplies;
