import React from "react";

const MyTweetPage = ({ tweets }) => {
  if (!tweets?.length) return <p className="text-gray-500">No tweets found.</p>;

  return tweets.map((tweet) => (
    <div
      key={tweet.id}
      className="p-3 bg-[#16181c] rounded-lg border border-gay-800 mb-3"
    >
      <p>{tweet.content}</p>
      {tweet.media && (
        <img
          src={tweet.media}
          alt="Tweet media"
          className="mt-2 rounded max-h-60"
        />
      )}
      <p className="text-xs text-gray-500 mt-1">
        {new Date(tweet.createdAt).toLocaleString()}{" "}
      </p>
    </div>
  ));
};
export default MyTweetPage;
