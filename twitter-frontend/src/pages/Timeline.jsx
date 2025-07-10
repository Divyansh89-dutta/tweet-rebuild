import React, { useEffect, useState } from "react";
import API from "../api/axios";
import TweetItem from "../components/TweetItem";

function Timeline() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const res = await API.get("/tweets/timeline");
      setTweets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTweetUpdate = (updatedTweet) => {
    setTweets((prev) => {
      const exists = prev.some((t) => t._id === updatedTweet._id);
      if (exists) {
        return prev.map((t) =>
          t._id === updatedTweet._id ? updatedTweet : t
        );
      } else {
        return [updatedTweet, ...prev];
      }
    });
  };

  const handleTweetDelete = (tweetId) => {
    setTweets((prev) => prev.filter((t) => t._id !== tweetId));
  };

  return (
    <div>
      {tweets.map((tweet) => (
        <TweetItem
          key={tweet._id}
          tweet={tweet}
          onUpdate={handleTweetUpdate}
          onDelete={handleTweetDelete}
        />
      ))}
    </div>
  );
}

export default Timeline;
