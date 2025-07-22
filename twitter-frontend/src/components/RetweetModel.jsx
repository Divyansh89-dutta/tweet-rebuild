import React, { useState } from "react";

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#0f172a",
  border: "1px solid #333",
  padding: "20px",
  zIndex: 1000,
  width: "90%",
  maxWidth: "500px",
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
  color: "#fff",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
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
        <h2 className="text-lg font-semibold mb-4">Retweet with Comment</h2>

        {/* Tweet Preview Box */}
        <div className="bg-[#0F173A] border border-gray-700 rounded-md p-3 mb-4">
          <strong className="block mb-1">
            @{tweet.user?.username} ({tweet.user?.name})
          </strong>
          <p className="text-sm text-gray-300">{tweet.content}</p>
        </div>

        {/* Textarea */}
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Add your comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-24 p-2 rounded-md bg-[#0F173A] border border-gray-700 text-white mb-4 resize-none"
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 rounded-md bg-red-500 hover:bg-gray-700 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
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
