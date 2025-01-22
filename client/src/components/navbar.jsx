import { useEffect, useState } from "react";
import { auth, provider } from "../firebase"; // Import from your firebase.js
import { signInWithPopup, signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import logo from "../../public/srmaplogo.png";

function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle the menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to control dropdown visibility

  useEffect(() => {
    // Check auth state on component mount
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email.endsWith("@srmap.edu.in")) {
        setUser(currentUser); // Keep the user signed in
      } else {
        setUser(null); // Sign out unauthorized users
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      // Check if the email belongs to the @srmap.edu.in domain
      if (!result.user.email.endsWith("@srmap.edu.in")) {
        alert("Please Log-In using your university E-mail ID");
        await signOut(auth);
        return;
      }

      setUser(result.user);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between bg-[#4d6b2c] px-6 py-4 text-white">
      {/* Logo */}
      <img
        src={logo}
        alt="SRM AP Logo"
        className="h-12 object-contain"
      />

      {/* Hamburger Menu for Mobile */}
      <button
        className="block md:hidden text-2xl focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Navigation Links */}
      <div
        className={`absolute top-16 left-0 w-full bg-[#4d6b2c] md:static md:flex md:items-center md:space-x-4 ${menuOpen ? "block" : "hidden"}`}
      >
        {user ? (
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 p-4 md:p-0 md:ml-auto">
            {/* User Photo as Button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown visibility
              className="relative"
            >
              <img
                src={user.photoURL}
                alt="Profile"
                className="h-10 w-10 rounded-full cursor-pointer"
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-48 p-2 z-10">
                  <button
                    className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-[#f0f0f0]"
                  >
                    <a href="/profile">Go to Profile</a>
                  </button>
                </div>
              )}
            </button>
            <button
              onClick={handleSignOut}
              className="rounded bg-[#70703c] px-4 py-2 text-sm font-semibold hover:bg-[#5c5c31]"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 p-4 md:p-0 md:ml-auto">
            <button
              onClick={handleSignIn}
              className="rounded bg-[#5e7b34] px-4 py-2 text-sm font-semibold hover:bg-[#49642a]"
            >
              Sign In with Google
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
