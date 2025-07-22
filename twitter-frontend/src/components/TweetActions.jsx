import React, { useState } from "react";
import {
  Heart,
  ThumbsDown,
  Repeat2,
  Edit,
  Trash2,
  Bookmark,
  BookmarkMinus,
} from "lucide-react";

const TweetActions = ({
  tweet,
  isSaved,
  isOwner,
  isDeleting,
  handleLike,
  handleUnlike,
  setShowRetweetModal,
  handleSave,
  handleUnsave,
  setEditing,
  handleDelete,
}) => {
  const [likeAnim, setLikeAnim] = useState(false);
  const [unlikeAnim, setUnlikeAnim] = useState(false);

  const animate = (setter, action) => {
    setter(true);
    action();
    setTimeout(() => setter(false), 300);
  };

  return (
    <div className="flex flex-wrap items-center gap-3.5 mt-3 text-sm">
      <button
        onClick={() => animate(setLikeAnim, handleLike)}
        className="flex items-center gap-1 text-blue-500 hover:underline transition-transform duration-200"
      >
        <Heart
          className={`w-5 h-5 ${likeAnim ? "scale-125 text-red-500" : ""} transition-transform duration-200`}
        />
      </button>

      <button
        onClick={() => animate(setUnlikeAnim, handleUnlike)}
        className="flex items-center gap-1 text-blue-500 hover:underline transition-transform duration-200"
      >
        <ThumbsDown
          className={`w-4.5 h-4.5 ${unlikeAnim ? "scale-125 text-gray-500" : ""} transition-transform duration-200`}
        />
      </button>

      {!tweet.parent && (
        <button
          onClick={() => setShowRetweetModal(true)}
          className="flex items-center gap-1 text-blue-500 hover:underline"
        >
          <Repeat2 className="w-5 h-5" />
          
        </button>
      )}

      <button
        onClick={isSaved ? handleUnsave : handleSave}
        className="flex items-center gap-1 text-blue-500 hover:underline"
      >
        {isSaved ? (
          <BookmarkMinus className="w-4.5 h-4.5" />
        ) : (
          <Bookmark className="w-4.5 h-4.5" />
        )}
      </button>

      {isOwner && (
        <>
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-blue-500 hover:underline"
          >
            <Edit className="w-4.5 h-4.5" />
            
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1 text-red-500 hover:underline"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </>
      )}

      <span className="text-gray-600 ml-auto">
        Likes: {tweet.likes?.length || 0}
      </span>
    </div>
  );
};

export default TweetActions;
