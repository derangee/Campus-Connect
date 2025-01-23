import { useState, useEffect } from "react";
import { auth } from "../firebase"; // Import your Firebase config
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import LocalAirportOutlinedIcon from "@mui/icons-material/LocalAirportOutlined";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";
import DirectionsBusFilledOutlinedIcon from "@mui/icons-material/DirectionsBusFilledOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import WindowOutlinedIcon from "@mui/icons-material/WindowOutlined";

const Home = () => {
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Set the user when authentication state changes
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  const handleButtonClick = (label) => {
    setSelectedRequest(label); // Set the type of request
    setSidebarVisible(true); // Show the sidebar
  };

  const closeSidebar = () => {
    setSidebarVisible(false); // Hide the sidebar
    setSelectedRequest(""); // Clear the selected request
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="text-center h-full mt-7 relative flex-grow">
        {user ? (
          <div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                <span className="text-black"> Welcome, </span>
                <span>{user.displayName}</span>!
              </h1>
            </div>

            {/* Box Container for New Request */}
            <div className="p-8 rounded-3xl shadow-lg mt-10 w-4/5 mx-auto bg-[#4d6b2c]">
              <h2 className="text-4xl font-bold mb-6 text-white">
                New Request +
              </h2>
              <div className="flex justify-center flex-wrap gap-4 sm:gap-6">
                {[
                  { icon: <BookOutlinedIcon style={{ fontSize: "50px" }} />, label: "Projects" },
                  { icon: <EmojiEventsOutlinedIcon style={{ fontSize: "50px" }} />, label: "Competition" },
                  { icon: <LocalAirportOutlinedIcon style={{ fontSize: "50px" }} />, label: "Trips" },
                  { icon: <DirectionsBusFilledOutlinedIcon style={{ fontSize: "50px" }} />, label: "Outing" },
                  { icon: <QuestionMarkOutlinedIcon style={{ fontSize: "50px" }} />, label: "Lost & Found" },
                  { icon: <GroupsOutlinedIcon style={{ fontSize: "50px" }} />, label: "Teammate" },
                  { icon: <WindowOutlinedIcon style={{ fontSize: "50px" }} />, label: "Room-mates" },
                ].map(({ icon, label }) => (
                  <button
                    key={label}
                    onClick={() => handleButtonClick(label)}
                    className="bg-[#618b33] w-32 h-32 flex flex-col items-center justify-center text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
                  >
                    {icon}
                    <span className="mt-2 text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            {sidebarVisible && (
              <div
                className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-[#28430d] shadow-lg z-50 p-6  overflow-y-auto transition-transform duration-300"
                style={{
                  transform: sidebarVisible ? "translateX(0)" : "translateX(100%)",
                }}
              >
                <button
                  onClick={closeSidebar}
                  className="text-white font-bold text-xl absolute top-4 right-4"
                >
                  &times;
                </button>
                <h2 className="text-2xl text-white font-bold mb-4">
                  Create a {selectedRequest} Request
                </h2>
                {/* Add form fields or additional content here */}
                <form>
                  <label className="block text-white font-bold mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md mb-4"
                    placeholder={`Enter ${selectedRequest} title`}
                  />
                  <label className="block text-white font-bold mb-2">Description</label>
                  <textarea
                    className="w-full p-2 border rounded-md mb-4"
                    placeholder={`Describe your ${selectedRequest}`}
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <h1 className="text-3xl font-bold">Please Sign-In...</h1>
        )}
      </div>
    </div>
  );
};

export default Home;
