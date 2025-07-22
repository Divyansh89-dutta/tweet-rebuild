import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { div } from 'framer-motion/client';
import { ArrowLeft } from 'lucide-react';

const Search = () => {
  const [q, setQ] = useState('');
  const [results, setResults] = useState({ users: [], tweets: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (q.trim()) {
        fetchSearchResults();
      } else {
        setResults({ users: [], tweets: [] });
      }
    }, 300); // debounce API call

    return () => clearTimeout(delayDebounceFn);
  }, [q]);

  const fetchSearchResults = async () => {
    try {
      const res = await API.get(`/search?q=${q}`);
      setResults(res.data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className='h-screen text-white bg-gradient-to-b from-black  via-[#0f172a] to-[#1e293b]'>
       <div className="absolute top-0 left-0 w-60 h-60 bg-blue-500 opacity-30 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-fuchsia-600 opacity-30 blur-3xl rounded-full" />
    <div className="max-w-2xl mx-auto p-4">
      <div className="relative flex items-center justify-center mb-6">
        <button
        onClick={() => navigate(-1)}
        className='mr-2 p-2 rounded-full hover:bg-gray-700' 
        >
           <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <input
          type="text"
          placeholder="Search users or tweets..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

       {results.users.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-3">Users</h2>
            <div className="space-y-2">
              {results.users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user.username)}
                  className="flex items-center gap-3 p-3 bg-[#0B1F3F] rounded-lg shadow hover:bg-[#1a2c4b] cursor-pointer transition-all"
                >
                  <img
                    src={user.profilePic || '/default-avatar.png'}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover border border-gray-700"
                  />
                  <div>
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-gray-400 text-sm">@{user.username}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.tweets.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-3">Tweets</h2>
            <div className="space-y-3">
              {results.tweets.map((tweet) => (
                <div key={tweet._id} className="p-4 bg-[#0B1F3F] rounded-lg shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={tweet.user.profilePic || '/default-avatar.png'}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border border-gray-700"
                    />
                    <div>
                      <div
                        onClick={() => handleUserClick(tweet.user.username)}
                        className="font-semibold text-blue-400 hover:underline cursor-pointer"
                      >
                        @{tweet.user.username}
                      </div>
                    </div>
                  </div>
                  <div className="text-white ml-12 -mt-4">{tweet.content}</div>
                  {tweet.media && (
                    <img
                      src={tweet.media}
                      alt="tweet-media"
                      className="rounded mt-3 max-h-60 object-cover w-full"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
