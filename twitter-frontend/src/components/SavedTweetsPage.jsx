// components/SavedTweetsPage.jsx
import React from 'react';

const SavedTweetsPage = ({ savedTweets }) => {
  if (!savedTweets?.length) return <p className="text-gray-500">No saved tweets.</p>;

  return savedTweets.map((tweet) => (
    <div key={tweet._id} className="p-3 bg-[#16181C] rounded-lg border border-gray-800 mb-3">
      <p>{tweet.content}</p>
      {tweet.media && <img src={tweet.media} alt="" className="rounded mt-2 max-h-60" />}
      <p className="text-xs text-gray-500 mt-1">{new Date(tweet.createdAt).toLocaleString()}</p>
    </div>
  ));
};

export default SavedTweetsPage;
