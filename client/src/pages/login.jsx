/* eslint-disable no-unused-vars */
import  { useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      // Check if the email belongs to the @srmap.edu.in domain
      if (!result.user.email.endsWith("@srmap.edu.in")) {
        setError("Please log in using your university email ID.");
        await signOut(auth); // Sign out the user if the email is invalid
        return;
      }

      // Navigate to home after successful login
      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          onClick={handleSignIn}
          className="w-full rounded bg-[#5e7b34] px-4 py-2 text-sm font-semibold text-white hover:bg-[#49642a]"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
