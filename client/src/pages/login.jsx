/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

// Hardcoded list of admin emails
const adminEmails = ["daksh_vashishtha@srmap.edu.in", "admin2@srmap.edu.in"];

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!adminEmails.includes(user.email)) {
          navigate("/");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      if (result.user.email.endsWith("@srmap.edu.in")) {
        navigate("/"); // Redirect regular users to home
      } else {
        alert("Please log in using your university email.");
        await signOut(auth);
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleAdminLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      if (adminEmails.includes(result.user.email)) {
        navigate("/admin"); 
      } else {
        alert("Access denied. Admins only.");
        await signOut(auth);
      }
    } catch (error) {
      console.error("Error during admin login:", error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <button
          onClick={handleSignIn}
          className="w-full rounded bg-[#5e7b34] px-4 py-2 text-sm font-semibold text-white hover:bg-[#49642a] mb-4"
        >
          Student Login
        </button>
        <button
          onClick={handleAdminLogin}
          className="w-full rounded bg-[#5e7b34] px-4 py-2 text-sm font-semibold text-white hover:bg-[#49642a]"
        >
          Admin Login
        </button>
      </div>
    </div>
  );
}

export default Login;
