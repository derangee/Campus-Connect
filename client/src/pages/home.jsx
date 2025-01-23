import { useState, useEffect } from "react";
import { auth } from "../firebase"; // Import your Firebase config
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import LocalAirportOutlinedIcon from '@mui/icons-material/LocalAirportOutlined';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import DirectionsBusFilledOutlinedIcon from '@mui/icons-material/DirectionsBusFilledOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';

const Home = () => {
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
        <div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              <span className="text-black"> Welcome, </span><span>{user.displayName}</span>!
            </h1>
          </div>

          {/* Box Container for New Request */}
          <div className="p-8 rounded-3xl shadow-lg mt-10 w-4/5 mx-auto bg-[#4d6b2c]"> 
            <h2 className="text-4xl font-bold mb-6 text-white">New Request + </h2>
            <div className="flex justify-center flex-wrap gap-4 sm:gap-6">
              {[
                { icon: <BookOutlinedIcon style={{ fontSize: '50px' }} />, label: "Projects" },
                { icon: <EmojiEventsOutlinedIcon style={{ fontSize: '50px' }} />, label: "Competition" },
                { icon: <LocalAirportOutlinedIcon style={{ fontSize: '50px' }} />, label: "Trips" },
                { icon: <DirectionsBusFilledOutlinedIcon style={{ fontSize: '50px' }} />, label: "Outing" },
                { icon: <QuestionMarkOutlinedIcon style={{ fontSize: '50px' }} />, label: "Lost & Found" },
                { icon: <GroupsOutlinedIcon style={{ fontSize: '50px' }} />, label: "Teammate" },
                { icon: <WindowOutlinedIcon style={{ fontSize: '50px' }} />, label: "Room-mates" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  className="bg-[#618b33] w-32 h-32 flex flex-col items-center justify-center text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
                >
                  {icon}
                  <span className="mt-2 text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-3xl font-bold">Please Sign-In...</h1>
      )}
    </div>
  );
};

export default Home;
