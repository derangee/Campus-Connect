import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs, query, doc, updateDoc, arrayUnion } from "firebase/firestore";
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
  const [requests, setRequests] = useState([]); // Stores active requests
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    duration: "",
    teammateExpectations: "",
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    const fetchRequests = async () => {
      const q = query(collection(db, "requests"));
      const querySnapshot = await getDocs(q);
      const fetchedRequests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(fetchedRequests);
    };

    fetchRequests();

    return () => unsubscribe();
  }, []);

  const handleButtonClick = (label) => {
    setSelectedRequest(label);
    setSidebarVisible(true);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
    setSelectedRequest("");
    setFormData({
      title: "",
      description: "",
      skillsRequired: "",
      duration: "",
      teammateExpectations: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      !formData.skillsRequired ||
      !formData.duration ||
      !formData.teammateExpectations
    ) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    const newRequest = {
      type: selectedRequest,
      title: formData.title,
      description: formData.description,
      skillsRequired: formData.skillsRequired,
      duration: formData.duration,
      teammateExpectations: formData.teammateExpectations,
      createdBy: user?.uid || "Anonymous",
      createdByName: user?.displayName || "Anonymous",
      createdAt: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, "requests"), newRequest);
      setRequests((prevRequests) => [
        { id: docRef.id, ...newRequest },
        ...prevRequests,
      ]);
      closeSidebar();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleApply = async (requestId) => {
    const skills = prompt("Enter your skills:");
    if (!skills) return;

    try {
      const requestRef = doc(db, "requests", requestId);
      await updateDoc(requestRef, {
        applicants: arrayUnion({
          userId: user.uid,
          name: user.displayName,
          skills,
        }),
      });
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for request: ", error);
    }
  };

  const viewApplicants = (applicants) => {
    if (!applicants || applicants.length === 0) {
      alert("No applicants yet.");
      return;
    }

    const applicantList = applicants
      .map((applicant) => `${applicant.name}: ${applicant.skills}`)
      .join("\n");
    alert(`Applicants:\n${applicantList}`);
  };

  const myRequests = requests.filter((request) => request.createdBy === user?.uid);
  const activeRequests = requests.filter((request) => request.createdBy !== user?.uid);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="text-center mt-7 flex-grow">
        {user ? (
          <>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                <span className="text-black">Welcome, </span>
                <span>{user.displayName}</span>!
              </h1>
            </div>

            {/* New Request Section */}
            <div className="p-8 rounded-3xl shadow-lg mt-10 w-4/5 mx-auto bg-[#4d6b2c]">
              <h2 className="text-4xl font-bold mb-6 text-white">New Request +</h2>
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
            <div className="mt-10">
              <h2 className="text-3xl font-bold mb-4 text-[#28430d]">My Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myRequests.map((request) => (
                  <div key={request.id} className="p-4 bg-white shadow-md rounded-md border border-gray-300">
                    <h3 className="text-xl font-bold mb-2">{request.title}</h3>
                    <p className="text-gray-700"><strong>Type:</strong> {request.type}</p>
                    <p className="text-gray-700"><strong>Description:</strong> {request.description}</p>
                    <p className="text-gray-700"><strong>Skills Required:</strong> {request.skillsRequired}</p>
                    <p className="text-gray-700"><strong>Duration:</strong> {request.duration}</p>
                    <p className="text-gray-700"><strong>Expectations:</strong> {request.teammateExpectations}</p>
                    <p className="text-gray-700 mt-2"><strong>Created By:</strong> {request.createdByName}</p>
                    <button
                      className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
                      onClick={() => viewApplicants(request.applicants)}
                    >
                      View Applicants
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Requests */}
            <div className="mt-10">
              <h2 className="text-3xl font-bold mb-4 text-[#28430d]">Active Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeRequests.map((request) => (
                  <div key={request.id} className="p-4 bg-white shadow-md rounded-md border border-gray-300">
                    <h3 className="text-xl font-bold mb-2">{request.title}</h3>
                    <p className="text-gray-700"><strong>Type:</strong> {request.type}</p>
                    <p className="text-gray-700"><strong>Description:</strong> {request.description}</p>
                    <p className="text-gray-700"><strong>Skills Required:</strong> {request.skillsRequired}</p>
                    <p className="text-gray-700"><strong>Duration:</strong> {request.duration}</p>
                    <p className="text-gray-700"><strong>Expectations:</strong> {request.teammateExpectations}</p>
                    <p className="text-gray-700 mt-2"><strong>Created By:</strong> {request.createdByName}</p>
                    <button
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                      onClick={() => handleApply(request.id)}
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            {sidebarVisible && (
              <div className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-[#28430d] shadow-lg z-50 p-6 overflow-y-auto">
                <button
                  onClick={closeSidebar}
                  className="text-white font-bold text-xl absolute top-4 right-4"
                >
                  &times;
                </button>
                <h2 className="text-2xl text-white font-bold mb-4">Create a {selectedRequest} Request</h2>
                <form onSubmit={handleSubmit}>
                  <label className="block text-white font-bold mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md mb-4"
                    placeholder={`Enter ${selectedRequest} title`}
                  />
                  <label className="block text-white font-bold mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md mb-4"
                    placeholder={`Describe your ${selectedRequest}`}
                  ></textarea>
                  <label className="block text-white font-bold mb-2">Skills Required</label>
                  <input
                    type="text"
                    name="skillsRequired"
                    value={formData.skillsRequired}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md mb-4"
                    placeholder="Skills required for this request"
                  />
                  <label className="block text-white font-bold mb-2">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md mb-4"
                    placeholder="Expected duration (e.g., 2 weeks)"
                  />
                  <label className="block text-white font-bold mb-2">Teammate Expectations</label>
                  <textarea
                    name="teammateExpectations"
                    value={formData.teammateExpectations}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md mb-4"
                    placeholder="What qualities/skills you expect in a teammate"
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
          </>
        ) : (
          <h1 className="text-3xl font-bold">Please Sign-In...</h1>
        )}
      </div>
    </div>
  );
};

export default Home;
