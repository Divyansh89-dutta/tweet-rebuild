import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import API from "../api/axios";
import TweetCard from "../components/TweetCard";
import TweetItem from "../components/TweetItem";
import socket from "../utils/socket";

function Home() {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🚫 Redirect to login if not authenticated
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
        prev.map((t) => {
          if (t._id === updatedTweet._id) {
            return {
              ...updatedTweet,
              replies: updatedTweet.replies?.length
                ? updatedTweet.replies
                : t.replies,
            };
          }
          return {
            ...t,
            replies:
              t.replies?.map((r) =>
                r._id === updatedTweet._id ? updatedTweet : r
              ) || [],
          };
        })
      );
    });

    socket.on("retweetCreated", (retweet) => {
      setTweets((prev) => [retweet, ...prev]);
    });

    socket.on("replyCreated", (reply) => {
      setTweets((prev) =>
        prev.map((t) => {
          if (t._id === reply.parent) {
            return {
              ...t,
              replies: [...(t.replies || []), reply],
            };
          }
          return t;
        })
      );
    });

    return () => {
      socket.off("newTweet");
      socket.off("likeUpdated");
      socket.off("retweetCreated");
      socket.off("replyCreated");
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <nav className="flex gap-4 p-2 bg-gray-100 border-b">
        <Link to="/profile" className="text-blue-600 hover:underline">
          Profile
        </Link>
        <Link to="/search" className="text-blue-600 hover:underline">
          Search
        </Link>
      </nav>
      <h1 className="text-2xl font-bold my-4">Timeline</h1>

      <TweetCard onTweetPosted={fetchTimeline} />

      {loading ? (
        <p>Loading tweets...</p>
      ) : tweets.length === 0 ? (
        <p>No tweets yet.</p>
      ) : (
        tweets
          .filter(
            (tweet) =>
              !tweet.parent || (tweet.parent && tweet.content?.trim() !== "")
          )
          .map((tweet) => <TweetItem key={tweet._id} tweet={tweet} />)
      )}
    </div>
  );
}

export default Home;
