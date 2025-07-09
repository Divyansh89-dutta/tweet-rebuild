import React, { useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom';

function Search() {
    const [q, setQ] = useState('');
    const [results, setResults] = useState({
        users: [],
        tweets: []
    })
    const navigate = useNavigate();

    const handleSearch = async(e) => {
        e.preventDefault();
        const res = await API.get(`/search?q=${q}`);
        setResults(res.data);
    }

    const handleUserClick = (username) => {
        navigate(`/profile/${username}`);
        console.log(`Navigating to profile of ${username}`);
    }
  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search users or tweets..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="input flex-grow"
        />
        <button className="btn-primary">Search</button>
      </form>

      {results.users.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Users</h2>
          {results.users.map(user => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user.username)}
              className="block p-2 border-b cursor-pointer hover:bg-gray-100"
            >
              <div className="font-bold">@{user.username}</div>
              <div className="text-sm">{user.name}</div>
            </div>
          ))}
        </div>
      )}

      {results.tweets.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-2">Tweets</h2>
          {results.tweets.map(tweet => (
            <div key={tweet._id} className="p-3 bg-white shadow rounded mb-2">
              <div
                onClick={() => handleUserClick(tweet.user.username)}
                className="font-bold cursor-pointer hover:underline"
              >
                @{tweet.user.username}
              </div>
              <div>{tweet.content}</div>
              {tweet.media && <img src={tweet.media} className="rounded mt-2 max-h-60" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search