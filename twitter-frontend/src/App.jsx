import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import UserProfile from "./pages/UserProfile";
import PrivateRoute from "./components/PrivateRoute";
import Notifications from "./pages/Notifications";
import EditRetweet from "./components/RetweetModel";
import RetweetModal from "./components/RetweetModel";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:username"
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/search"
        element={
          <PrivateRoute>
            <Search />
          </PrivateRoute>
        }
      />
      <Route path="/notifications" element={<Notifications />} />
      <Route
  path="/retweet/edit/:id"
  element={
    <PrivateRoute>
      <RetweetModal />
    </PrivateRoute>
  }
/>

      {/* Optional catch-all */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

