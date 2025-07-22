import React from "react";

const ReplyBox = ({ replyText, setReplyText, handleReply }) => {
  return (
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
  );
};

export default ReplyBox;
