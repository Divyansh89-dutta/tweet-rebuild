import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ user }) => {
  const avatar = user?.avatar;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const location = useLocation();
  const isHome = location.pathname === "/";
  const isProfile = location.pathname.startsWith("/profile");
  const isSearch = location.pathname === "/search";

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-xl mb-4">
      {/* X logo navigates to Home */}
      <Link to="/home" className="text-xl font-bold text-white hover:text-cyan-400">
        X
      </Link>

      <div className="flex items-center gap-4">
        {/* Always show Search */}
        <Link to="/search" className="text-cyan-400 hover:text-white">
          Search
        </Link>

        {/* Show Home instead of Profile when not on Home */}
        {(isProfile || isSearch) ? (
          <Link to="/home" className="text-cyan-400 hover:text-white">
            Home
          </Link>
        ) : (
          <Link to="/profile" className="text-cyan-400 hover:text-white">
            Profile
          </Link>
        )}

        {/* Avatar */}
        <Link to="/profile">
          {avatar ? (
            <img
              src={avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-cyan-400 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
              {initials}
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
