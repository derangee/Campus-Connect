import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase"; // Import your Firebase config
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import LocalAirportOutlinedIcon from "@mui/icons-material/LocalAirportOutlined";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";
import DirectionsBusFilledOutlinedIcon from "@mui/icons-material/DirectionsBusFilledOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import WindowOutlinedIcon from "@mui/icons-material/WindowOutlined";

const API_URL = "http://localhost:5000"; // Your backend URL

const Home = () => {
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState("");
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [activeRequests, setActiveRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [skills, setSkills] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/requests`);
        setRequests(data);

        if (user) {
          setMyRequests(data.filter((req) => req.createdBy === user.uid));
          setActiveRequests(data.filter((req) => req.createdBy !== user.uid));
        } else {
          setActiveRequests(data);
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    fetchRequests();
  }, [user]);

  const handleButtonClick = (label) => {
    setSelectedRequest(label);
    setSidebarVisible(true);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
    setSelectedRequest("");
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;

    if (!title || !description) {
      alert("Please fill in all fields.");
      return;
    }

    const newRequest = {
      title,
      description,
      type: selectedRequest,
      createdBy: user ? user.uid : "Anonymous",
    };

    try {
      const { data } = await axios.post(`${API_URL}/requests`, newRequest);
      setMyRequests([...myRequests, data]);
      closeSidebar();
      alert("Request created successfully!");
    } catch (err) {
      console.error("Error creating request:", err);
      alert("Failed to create request. Please try again.");
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!skills.trim()) {
      alert("Please provide your skills before applying.");
      return;
    }

    try {
      await axios.post(`${API_URL}/requests/${selectedRequestId}/apply`, {
        userId: user.uid,
        name: user.displayName,
        skills,
      });

      alert("Application submitted successfully!");
      setSelectedRequestId(null);
      setSkills("");
    } catch (err) {
      console.error("Error applying for request:", err);
      alert("Failed to apply for the request. Please try again.");
    }
  };

  const viewApplicants = async (requestId) => {
    try {
      const { data } = await axios.get(`${API_URL}/requests/${requestId}/applicants`);
      alert(
        data.length > 0
          ? `Applicants:\n${data.map((app) => `Name: ${app.name}, Skills: ${app.skills}`).join("\n")}`
          : "No applicants yet."
      );
    } catch (err) {
      console.error("Error fetching applicants:", err);
      alert("Failed to fetch applicants. Please try again.");
    }
  };

  return (
    <div className="text-center h-screen mt-7 relative">
      {user ? (
        <div>
          <h1 className="text-4xl font-bold">
            Welcome, <span className="text-blue-600">{user.displayName}</span>!
          </h1>

          {/* New Request Section */}
          <div className="p-8 rounded-3xl shadow-lg mt-10 w-4/5 mx-auto bg-[#4d6b2c]">
            <h2 className="text-4xl font-bold mb-6 text-white">New Request + </h2>
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

          {/* My Requests */}
          <div className="p-8 rounded-3xl shadow-lg mt-10 w-4/5 mx-auto bg-[#4d6b2c] text-white">
            <h2 className="text-3xl font-bold mb-6">My Requests</h2>
            {myRequests.length > 0 ? (
              myRequests.map((request) => (
                <div key={request._id} className="p-4 mb-4 bg-gray-800 text-white rounded-md">
                  <h3 className="text-xl font-bold">{request.title}</h3>
                  <p>{request.description}</p>
                  <button
                    onClick={() => viewApplicants(request._id)}
                    className="mt-4 bg-green-600 px-4 py-2 rounded-md text-white"
                  >
                    View Applicants
                  </button>
                </div>
              ))
            ) : (
              <p>No requests created yet.</p>
            )}
          </div>

          {/* Active Requests */}
          <div className="p-8 rounded-3xl shadow-lg mt-10 w-4/5 mx-auto bg-[#618b33] text-white">
            <h2 className="text-3xl font-bold mb-6">Active Requests</h2>
            {activeRequests.length > 0 ? (
              activeRequests.map((request) => (
                <div key={request._id} className="p-4 mb-4 bg-gray-800 text-white rounded-md">
                  <h3 className="text-xl font-bold">{request.title}</h3>
                  <p>{request.description}</p>
                  <button
                    onClick={() => setSelectedRequestId(request._id)}
                    className="mt-4 bg-blue-600 px-4 py-2 rounded-md text-white"
                  >
                    Apply
                  </button>
                </div>
              ))
            ) : (
              <p>No active requests available.</p>
            )}
          </div>

          {/* Sidebar */}
          {sidebarVisible && (
            <div className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-[#28430d] shadow-lg z-50 p-6 overflow-y-auto transition-transform">
              <button
                onClick={closeSidebar}
                className="text-white font-bold text-xl absolute top-4 right-4"
              >
                &times;
              </button>
              <h2 className="text-2xl text-white font-bold mb-4">
                Create a {selectedRequest} Request
              </h2>
              <form onSubmit={handleSubmitRequest}>
                <label className="block text-white font-bold mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  className="w-full p-2 border rounded-md mb-4"
                  placeholder={`Enter ${selectedRequest} title`}
                />
                <label className="block text-white font-bold mb-2">Description</label>
                <textarea
                  name="description"
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

          {/* Application Modal */}
          {selectedRequestId && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
                <h2 className="text-2xl font-bold mb-4">Apply to Request</h2>
                <form onSubmit={handleApply}>
                  <label className="block font-bold mb-2">Skills</label>
                  <textarea
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4"
                    placeholder="List your skills and relevant experience"
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedRequestId(null)}
                      className="bg-gray-300 px-4 py-2 rounded-md mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Apply
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <h1 className="text-4xl font-bold">Please log in to continue.</h1>
      )}
    </div>
  );
};

export default Home;
