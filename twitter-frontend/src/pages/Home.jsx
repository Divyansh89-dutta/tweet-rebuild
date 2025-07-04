import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { Link } from "react-router-dom";
import TweetCard from "../components/TweetCard";
import TweetItem from "../components/TweetItem";
import socket from "../utils/socket";

function Home() {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (user?.token) {
      fetchTimeline();
      socket.connect();
      socket.on("newTweet", (tweet) => {
        setTweets((prev) => [tweet, ...prev]);
      });

      socket.on("likeUpdated", (updatedTweet) => {
        setTweets((prev) =>
          prev.map((t) => {
            if (t._id === updatedTweet._id) {
              return updatedTweet;
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
    }
  }, [user]);

  return (
    <div>
      <nav>
        <Link to="/profile">Profile</Link>
      </nav>
      <h1>Timeline</h1>

      <TweetCard onTweetPosted={fetchTimeline} />

      {loading ? (
        <p>Loading tweets...</p>
      ) : tweets.length === 0 ? (
        <p>No tweets yet.</p>
      ) : (
        tweets.map((tweet) => <TweetItem key={tweet._id} tweet={tweet} />)
      )}
    </div>
  );
}

export default Home;
