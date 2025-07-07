import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import TweetCard from "../components/TweetCard";
import TweetItem from "../components/TweetItem";
import socket from "../utils/socket";

import { Home as HomeIcon, User as UserIcon } from "lucide-react";

function Home() {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-gray-800 border-b border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-200 hover:text-blue-400">
            <HomeIcon className="w-6 h-6" />
            <span className="hidden sm:inline text-lg font-semibold">Home</span>
          </Link>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/profile")}
            title="Go to profile"
          >
            <img
              src={user?.avatar || "https://i.pravatar.cc/40"}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border border-gray-600 hover:border-blue-400"
            />
            <span className="hidden sm:inline text-sm text-gray-300 hover:text-blue-400">
              Profile
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <TweetCard onTweetPosted={fetchTimeline} />

        {loading ? (
          <p className="text-center text-gray-400">Loading tweets...</p>
        ) : tweets.length === 0 ? (
          <p className="text-center text-gray-500">No tweets yet.</p>
        ) : (
          tweets
            .filter(
              (tweet) =>
                !tweet.parent || (tweet.parent && tweet.content?.trim() !== "")
            )
            .map((tweet) => <TweetItem key={tweet._id} tweet={tweet} />)
        )}
      </main>
    </div>
  );
}

export default Home;
