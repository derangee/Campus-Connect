import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, provider } from "../firebase"; // Import from your firebase.js
import { signInWithPopup, signOut } from "firebase/auth";

function navbar() {
  const [user, setUser] = useState(null);

  // Handle Sign In
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); // Set the signed-in user's data
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user data on sign-out
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <nav className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-blue-800 px-6 py-4 text-white">
      {/* Navigation Links */}
      <div className="flex space-x-6">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/profile" className="hover:underline">
          Profile
        </Link>
        <Link to="/request" className="hover:underline">
          Request
        </Link>
        <Link to="/active-requests" className="hover:underline">
          Active Requests
        </Link>
        <Link to="/feedback" className="hover:underline">
          Feedback
        </Link>
      </div>

      {/* Sign In/Out Button */}
      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm font-medium">Hi, {user.displayName}</span>
            <button
              onClick={handleSignOut}
              className="rounded bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700"
          >
            Sign In with Google
          </button>
        )}
      </div>
    </nav>
  );
}

export default navbar;
