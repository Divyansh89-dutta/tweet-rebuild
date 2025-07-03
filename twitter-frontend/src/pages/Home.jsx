import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

function Home() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    async function fetchTweets() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/tweet/timeline", {
          header: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched Tweets:", res.data);
        setTweets(res.data.data || res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTweets();
  }, []);
  return (
    <div>
      <h2>Home feed</h2>
      <ul>
        {Array.isArray(tweets) &&
          tweets.map((tweet) => (
            <li key={tweet._id}>
              <strong>{tweet.user?.username}:</strong> {tweet.text}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Home;
