/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { auth } from "../firebase"; // Import your Firebase config

const home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Set the user when authentication state changes
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  return (
    <div className="text-center h-screen mt-7">
      {user ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"> <span className="text-black"> Welcome, </span><span>{user.displayName}</span>! </h1>
        </div>
      ) : (
        <h1 className="text-3xl font-bold">Please Sign-In...</h1>
      )}
    </div>
  );
};

export default home;
