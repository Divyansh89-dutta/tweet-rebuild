import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import socket from "../utils/socket";
import { ArrowLeft } from "lucide-react";

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("tweets");
  const navigate = useNavigate();


  const storedUser = localStorage.getItem("user");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  const fetchUser = async () => {
    try {
      const res = await API.get(`/users/${username}`);
      const fetchedUser = res.data;
      setUser(fetchedUser);

      const isUserFollowing =
        Array.isArray(fetchedUser.followers) &&
        loggedInUser &&
        fetchedUser.followers.some((f) => f._id === loggedInUser._id);
      setIsFollowing(isUserFollowing);
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.connect();
    fetchUser();

    socket.on("newTweet", (tweet) => {
      if (tweet?.user?.username === username) {
        setUser((prev) => ({
          ...prev,
          tweets: [tweet, ...(prev.tweets || [])],
        }));
      }
    });

    return () => socket.disconnect();
  }, [username]);

  const handleFollow = async () => {
    if (!user) return;
    try {
      setProcessing(true);
      await API.post(`/users/${user._id}/follow`);
      setIsFollowing(true);
      await fetchUser();
    } catch (e) {
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
      alert(e.response?.data?.message || "Failed to unfollow user");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!user) return <div className="p-4 text-red-500">User not found</div>;

  return (
    <div className=" bg-gradient-to-b from-gray-700  via-blue-600 text-white to-[#1e293b] h-screen w-full">
      <div className="max-w-2xl mx-auto p-4">
        <button
        onClick={() => navigate(-1)}
        className='mb-2 p-2 rounded-full hover:bg-gray-700' 
        >
           <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={
              user.avatar ||
              "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
            }
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-grow">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-gray-300">@{user.username}</p>
            {user.bio && <p className="text-sm mt-1">{user.bio}</p>}
          </div>
          {loggedInUser?._id !== user._id && (
            <button
              onClick={isFollowing ? handleUnfollow : handleFollow}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                isFollowing
                  ? "bg-gray-200 hover:bg-gray-300 text-black"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              disabled={processing}
            >
              {processing ? "..." : isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        {/* Follower Stats */}
        <div className="flex gap-6 text-sm mb-4">
          <span
            className="hover:underline cursor-pointer"
            onClick={() => setActiveTab("followers")}
          >
            <strong>{user.followers?.length || 0}</strong> Followers
          </span>
          <span
            className="hover:underline cursor-pointer"
            onClick={() => setActiveTab("following")}
          >
            <strong>{user.following?.length || 0}</strong> Following
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-4">
          <button
            className={`pb-2 ${
              activeTab === "tweets"
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("tweets")}
          >
            Tweets
          </button>
          <button
            className={`pb-2 ${
              activeTab === "followers"
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("followers")}
          >
            Followers
          </button>
          <button
            className={`pb-2 ${
              activeTab === "following"
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "tweets" && (
          <div>
            {user.tweets?.length > 0 ? (
              user.tweets.map((tweet) => (
                <div
                  key={tweet._id}
                  className="bg-[#15458e] shadow-sm p-4 rounded mb-3"
                >
                  <div className="text-sm text-gray-200">
                    @{user.username} ·{" "}
                    {new Date(tweet.createdAt).toLocaleDateString()}
                  </div>
                  <p className="mt-1">{tweet.content}</p>
                  {tweet.media && (
                    <img
                      src={tweet.media}
                      alt=""
                      className="mt-2 rounded-lg max-h-72 object-cover"
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No tweets yet.</p>
            )}
          </div>
        )}

        {activeTab === "followers" && (
          <div>
            {user.followers?.length > 0 ? (
              user.followers.map((f) => (
                <Link
                  key={f._id}
                  to={`/profile/${f.username}`}
                  className="block py-2 hover:bg-gray-100 rounded px-2"
                >
                  <div className="font-bold">@{f.username}</div>
                  <div className="text-sm text-gray-600">{f.name}</div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-400">No followers yet.</p>
            )}
          </div>
        )}

        {activeTab === "following" && (
          <div>
            {user.following?.length > 0 ? (
              user.following.map((f) => (
                <Link
                  key={f._id}
                  to={`/profile/${f.username}`}
                  className="block py-2 hover:bg-gray-100 rounded px-2"
                >
                  <div className="font-bold">@{f.username}</div>
                  <div className="text-sm text-gray-200">{f.name}</div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-400">Not following anyone.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
