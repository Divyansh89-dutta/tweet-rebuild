import React, { useState } from "react";

function RetweetModal({ tweet, onClose, onSubmit }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(content);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white p-6 rounded-2xl shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Retweet with comment</h3>

        {/* Original Tweet Preview */}
        <div className="bg-gray-800 p-3 rounded-md text-sm mb-4 border border-gray-700">
          <p className="font-medium text-blue-400">
            @{tweet.user?.username} ({tweet.user?.name})
          </p>
          <p className="text-gray-300">{tweet.content}</p>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Add your comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-800 text-gray-100 p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none"
            rows={3}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white"
            >
              Retweet
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default RetweetModal;
