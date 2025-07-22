import React from "react";

const TweetContent = ({
  tweet,
  editing,
  editedContent,
  setEditedContent,
  handleEdit,
  setEditing,
}) => {
  const isRetweet = tweet.parent && tweet.parent.user;
  const user = tweet.user || tweet.parent?.user;

  return (
    <div className="flex gap-3 ">
      {/* Avatar */}
      <img
        src={user?.avatar || "/default-avatar.png"}
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover border border-gray-600"
      />

      <div className="flex-1">
        {/* Username */}
        <div className="font-semibold text-sm text-white">
          @{tweet.user?.username} ({tweet.user?.name})
        </div>

        {/* Retweet Content Preview */}
        {isRetweet && (
          <div className="mt-2 border border-gray-600 bg-gray-900 rounded p-2 text-sm">
            <div className="text-gray-400 mb-1">
              Retweet from @{tweet.parent.user?.username}
            </div>
            <div className="text-white">{tweet.parent.content}</div>
          </div>
        )}

        {/* Main Tweet Content */}
        {editing ? (
          <div className="space-y-2 mt-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-11 border border-gray-600 bg-[#0f172a] rounded p-2 text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="px-3 py-1 bg-sky-500 text-white rounded hover:bg-sky-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1 bg-amber-900 text-white rounded hover:bg-sky-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2 text-white">{tweet.content}</div>
        )}

        {/* Media */}
        {tweet.media && (
          <img
            src={tweet.media}
            alt="media"
            className="mt-2 h-[20vh]  rounded"
          />
        )}

        {/* Timestamp */}
        <div className="text-gray-500 text-xs mt-2">
          {tweet.createdAt
            ? new Date(tweet.createdAt).toLocaleString()
            : "Invalid Date"}
        </div>
      </div>
    </div>
  );
};

export default TweetContent;
