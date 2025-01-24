import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { BookOutlined,EmojiEventsOutlined,LocalAirportOutlined,QuestionMarkOutlined,DirectionsBusFilledOutlined,GroupsOutlined,WindowOutlined,} from "@mui/icons-material";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleButtonClick = (label) => {
    setSelectedRequest(label);
    setSidebarVisible(true);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
    setSelectedRequest("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f8f2]">
      <div className="text-center h-full mt-7 flex-grow">
        {user ? (
          <div>
            {/* Welcome Section */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold text-black">
                Welcome,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  {user.displayName}
                </span>
                !
              </h1>
            </motion.div>

            {/* Request Options Section */}
            <motion.div
              className="p-8 rounded-3xl shadow-lg mt-10 w-4/5 mx-auto bg-[#4d6b2c] text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-6">New Request +</h2>
              <div className="flex justify-center flex-wrap gap-6">
                {[
                  { icon: <BookOutlined style={{ fontSize: "50px" }} />, label: "Projects" },
                  { icon: <EmojiEventsOutlined style={{ fontSize: "50px" }} />, label: "Competition" },
                  { icon: <LocalAirportOutlined style={{ fontSize: "50px" }} />, label: "Trips" },
                  { icon: <DirectionsBusFilledOutlined style={{ fontSize: "50px" }} />, label: "Outing" },
                  { icon: <QuestionMarkOutlined style={{ fontSize: "50px" }} />, label: "Lost & Found" },
                  { icon: <GroupsOutlined style={{ fontSize: "50px" }} />, label: "Teammate" },
                  { icon: <WindowOutlined style={{ fontSize: "50px" }} />, label: "Roommate" },
                ].map(({ icon, label }) => (
                  <motion.button
                    key={label}
                    onClick={() => handleButtonClick(label)}
                    whileHover={{ scale: 1.1 }}
                    className="bg-[#618b33] w-32 h-32 flex flex-col items-center justify-center text-white font-bold rounded-xl shadow-lg transition-transform"
                  >
                    {icon}
                    <span className="mt-2 text-sm">{label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Sidebar */}
            <AnimatePresence>
              {sidebarVisible && (
                <motion.div
                  className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-[#28430d] shadow-lg z-50 p-6 overflow-y-auto"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <button
                    onClick={closeSidebar}
                    className="text-white font-bold text-xl absolute top-4 right-4 hover:text-gray-300"
                  >
                    <FaTimes />
                  </button>
                  <h2 className="text-2xl text-white font-bold mb-4">
                    Create a {selectedRequest} Request
                  </h2>
                  <form>
                    <label className="block text-white font-bold mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md mb-4"
                      placeholder={`Enter ${selectedRequest} title`}
                    />
                    <label className="block text-white font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full p-2 border rounded-md mb-4"
                      placeholder={`Describe your ${selectedRequest}`}
                    ></textarea>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.1 }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                    >
                      Submit
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <h1 className="text-3xl font-bold">Please Sign-In...</h1>
        )}
      </div>
    </div>
  );
};

export default Home;
