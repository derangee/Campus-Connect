/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { FaUser, FaUserShield } from "react-icons/fa"; 
import logo from "../../public/logo.png"; // Replace with your university logo URL

// Hardcoded list of admin emails
const adminEmails = ["daksh_vashishtha@srmap.edu.in", "admin2@srmap.edu.in"];

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!adminEmails.includes(user.email)) {
          navigate("/"); // Redirect regular users to home
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
        {/* University Image Section */}
        <div className="flex justify-center">
          <img
            src={logo} // Replace with your university logo URL
            alt="University Logo"
            className="h-32 w-32 object-contain mb-4"
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Login</h1>

        {/* Student Login Button */}
        <button
          onClick={handleSignIn}
          className="w-full flex items-center justify-center gap-3 rounded-lg bg-[#5e7b34] px-4 py-3 text-white text-lg font-semibold hover:bg-[#49642a] transition duration-300"
        >
          <FaUser className="text-white" />
          Student Login
        </button>

        {/* Admin Login Button */}
        <button
          onClick={handleAdminLogin}
          className="w-full flex items-center justify-center gap-3 rounded-lg bg-[#5e7b34] px-4 py-3 text-white text-lg font-semibold hover:bg-[#49642a] transition duration-300"
        >
          <FaUserShield className="text-white" />
          Admin Login
        </button>
      </div>
    </div>
  );
}

export default Login;
