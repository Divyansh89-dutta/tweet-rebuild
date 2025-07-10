import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import socket from '../utils/socket';

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [processing, setProcessing] = useState(false);

  const storedUser = localStorage.getItem('user');
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  const fetchUser = async () => {
    try {
      const res = await API.get(`/users/${username}`);
      const fetchedUser = res.data;
      setUser(fetchedUser);

      // Debug logs
      console.log("Fetched user:", fetchedUser);
      console.log("Logged in user:", loggedInUser);

      const isUserFollowing =
        Array.isArray(fetchedUser.followers) &&
        loggedInUser &&
        fetchedUser.followers.some(
          (follower) => follower._id === loggedInUser._id
        );

      setIsFollowing(isUserFollowing);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.connect();

    fetchUser();

    socket.on("newTweet", (tweet) => {
      if (tweet?.user?.username === username) {
        setUser((prevUser) => ({
          ...prevUser,
          tweets: [tweet, ...(prevUser.tweets || [])],
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  const handleFollow = async () => {
    if (!user) return;
    try {
      setProcessing(true);
      await API.post(`/users/${user._id}/follow`);
      setIsFollowing(true);
      await fetchUser();
    } catch (e) {
      console.error("Follow error", e.response?.data || e.message);
      alert(e.response?.data?.message || "Failed to follow user");
    } finally {
      setProcessing(false);
    }
  };

  const handleUnfollow = async () => {
    if (!user) return;
    try {
      setProcessing(true);
      await API.post(`/users/${user._id}/unfollow`);
      setIsFollowing(false);
      await fetchUser();
    } catch (e) {
      console.error("Unfollow error", e.response?.data || e.message);
      alert(e.response?.data?.message || "Failed to unfollow user");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <div className="p-4 text-red-500">User not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">@{user.username}</h1>
      <p className="text-gray-600 mb-4">{user.name}</p>
      <p className="mb-1">Email: {user.email}</p>
      <p className="mb-4">Bio: {user.bio}</p>

      {/* Follow/Unfollow Button */}
      {loggedInUser?._id !== user._id && (
        <button
          onClick={isFollowing ? handleUnfollow : handleFollow}
          className={`px-4 py-2 rounded text-white font-bold ${
            isFollowing
              ? "bg-gray-600 hover:bg-gray-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={processing}
        >
          {processing
            ? "Processing..."
            : isFollowing
            ? "Unfollow"
            : "Follow"}
        </button>
      )}

      <div className="flex gap-6 mt-4 mb-4">
        <div>
          <span className="font-bold">{user.followers?.length || 0}</span>{" "}
          Followers
        </div>
        <div>
          <span className="font-bold">{user.following?.length || 0}</span>{" "}
          Following
        </div>
      </div>

      {user.followers?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Followers</h2>
          {user.followers.map((follower) => (
            <Link
              key={follower._id}
              to={`/profile/${follower.username}`}
              className="block border-b py-2 hover:bg-gray-100"
            >
              <div className="font-bold">@{follower.username}</div>
              <div className="text-sm text-gray-600">{follower.name}</div>
            </Link>
          ))}
        </div>
      )}

      {user.following?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Following</h2>
          {user.following.map((followed) => (
            <Link
              key={followed._id}
              to={`/profile/${followed.username}`}
              className="block border-b py-2 hover:bg-gray-100"
            >
              <div className="font-bold">@{followed.username}</div>
              <div className="text-sm text-gray-600">{followed.name}</div>
            </Link>
          ))}
        </div>
      )}

      {user.tweets?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Tweets</h2>
          {user.tweets.map((tweet) => (
            <div key={tweet._id} className="p-3 bg-white shadow rounded mb-2">
              <div>{tweet.content}</div>
              {tweet.media && (
                <img
                  src={tweet.media}
                  alt=""
                  className="rounded mt-2 max-h-60"
                />
              )}
              <p className="text-xs text-gray-500 mt-1">
                {new Date(tweet.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
