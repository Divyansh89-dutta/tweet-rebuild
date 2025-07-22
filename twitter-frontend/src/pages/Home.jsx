import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import API from "../api/axios";
import TweetCard from "../components/TweetCard";
import TweetItem from "../components/TweetItem";
import socket from "../utils/socket";
import Navbar from "../components/Navbar";
function Home() {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tweets/timeline");
      setTweets(res.data);
    } catch (err) {
      console.error("Failed to fetch tweets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
    socket.connect();

    socket.on("newTweet", (tweet) => {
      setTweets((prev) => [tweet, ...prev]);
    });

    socket.on("likeUpdated", (updatedTweet) => {
      setTweets((prev) =>
        prev.map((t) => (t._id === updatedTweet._id ? updatedTweet : t))
      );
    });

    socket.on("retweetCreated", (retweet) => {
      setTweets((prev) => [retweet, ...prev]);
    });

    socket.on("replyCreated", (reply) => {
      setTweets((prev) =>
        prev.map((t) =>
          t._id === reply.parent
            ? { ...t, replies: [...(t.replies || []), reply] }
            : t
        )
      );
    });

    socket.on("retweetUpdated", (updatedRetweet) => {
      setTweets((prev) =>
        prev.map((t) => (t._id === updatedRetweet._id ? updatedRetweet : t))
      );
    });

    return () => {
      socket.off("newTweet");
      socket.off("likeUpdated");
      socket.off("retweetCreated");
      socket.off("replyCreated");
      socket.off("retweetUpdated");
      socket.disconnect();
    };
  }, []);

  const handleTweetUpdate = (updatedTweet) => {
    setTweets((prev) =>
      prev.map((t) => (t._id === updatedTweet._id ? updatedTweet : t))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black  via-[#0f172a] to-[#1e293b] text-white px-5 py-4">
      <div className="absolute top-0 left-0 w-60 h-60 bg-blue-500 opacity-30 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-fuchsia-600 opacity-30 blur-3xl rounded-full" />
      <Navbar 
        user={user} 
       />

      {/* Tweet Input Card */}
      <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-4 shadow-md">
        <TweetCard onTweetPosted={fetchTimeline} />
      </div>

      {/* Tweet Feed */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Rajshree pan masala Swaad mein soch hai</h2>

      {loading ? (
        <p className="text-gray-300">Loading tweets...</p>
      ) : tweets.length === 0 ? (
        <p className="text-gray-400">No tweets yet.</p>
      ) : (
        tweets
          .filter(
            (tweet) =>
              !tweet.parent || (tweet.parent && tweet.content?.trim() !== "")
          )
          .map((tweet) => (
            <TweetItem
              key={tweet._id}
              tweet={tweet}
              onUpdate={handleTweetUpdate}
            />
          ))
      )}
    </div>
  );
}

export default Home;
