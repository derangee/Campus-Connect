import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs, query, doc, updateDoc, arrayUnion } from "firebase/firestore";
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
  const [requests, setRequests] = useState([]); // Stores all requests
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    duration: "",
    teammateExpectations: "",
    userLimit: "",
    sportName: "",
    date: "",
    time: "",
    venue: "",
    travellingFrom: "",
    travellingTo: "",
    timeOfTravel: "",
    travelMode: "",
    itemName: "",
    itemDescription: "",
    dateLostFound: "",
    locationLostFound: "",
    photo: null,
    roommatesGender: "",
    roomTypePreference: "",
    hostelTower: "",
    programYear: "",
    additionalInfo: "",
    participants: "", // Added participants field
    maxParticipants: "", // Add this line
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
      userLimit: "",
      sportName: "",
      date: "",
      time: "",
      venue: "",
      travellingFrom: "",
      travellingTo: "",
      timeOfTravel: "",
      travelMode: "",
      itemName: "",
      itemDescription: "",
      dateLostFound: "",
      locationLostFound: "",
      photo: null,
      roommatesGender: "",
      roomTypePreference: "",
      hostelTower: "",
      programYear: "",
      additionalInfo: "",
      participants: "", // Added participants field
      maxParticipants: "", // Add this line
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRequest = {
      type: selectedRequest,
      createdBy: user?.uid || "Anonymous",
      createdByName: user?.displayName || "Anonymous",
      createdAt: new Date(),
      applicants: [],
      participants: formData.participants, // Add this line
      maxParticipants: formData.maxParticipants, // Add this line
    };

    switch (selectedRequest) {
      case "Teammate":
        newRequest.title = formData.title;
        newRequest.description = formData.description;
        newRequest.requirement = formData.skillsRequired;
        newRequest.teammateType = formData.teammateExpectations;
        newRequest.additionalInfo = formData.additionalInfo;
        break;
      case "Sports":
        newRequest.sportName = formData.sportName;
        newRequest.date = formData.date;
        newRequest.time = formData.time;
        newRequest.venue = formData.venue;
        newRequest.additionalInfo = formData.additionalInfo;
        newRequest.participants = formData.participants; // Added participants field
        break;
      case "Trips":
      case "Outing":
        newRequest.travellingFrom = formData.travellingFrom;
        newRequest.travellingTo = formData.travellingTo;
        newRequest.timeOfTravel = formData.timeOfTravel;
        newRequest.travelMode = formData.travelMode;
        newRequest.additionalInfo = formData.additionalInfo;
        newRequest.participants = formData.participants; // Added participants field
        break;
      case "Lost & Found":
        newRequest.itemName = formData.itemName;
        newRequest.itemDescription = formData.itemDescription;
        newRequest.dateLostFound = formData.dateLostFound;
        newRequest.locationLostFound = formData.locationLostFound;
        newRequest.photo = formData.photo;
        newRequest.additionalInfo = formData.additionalInfo;
        break;
      case "Room-mates":
        newRequest.roommatesGender = formData.roommatesGender;
        newRequest.roomTypePreference = formData.roomTypePreference;
        newRequest.hostelTower = formData.hostelTower;
        newRequest.programYear = formData.programYear;
        newRequest.additionalInfo = formData.additionalInfo;
        break;
      default:
        break;
    }

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

  const handleApply = async (requestId, userLimit, applicants) => {
    if (applicants?.length >= userLimit) {
      alert("User limit reached. Cannot join this request.");
      return;
    }

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
      alert("You have successfully joined the request!");
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId
            ? {
                ...req,
                applicants: [
                  ...req.applicants,
                  { userId: user.uid, name: user.displayName, skills },
                ],
              }
            : req
        )
      );
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
                  { icon: <EmojiEventsOutlinedIcon style={{ fontSize: "50px" }} />, label: "Sports" },
                  { icon: <GroupsOutlinedIcon style={{ fontSize: "50px" }} />, label: "Teammate" },
                  { icon: <LocalAirportOutlinedIcon style={{ fontSize: "50px" }} />, label: "Trips" },
                  { icon: <DirectionsBusFilledOutlinedIcon style={{ fontSize: "50px" }} />, label: "Outing" },
                  { icon: <QuestionMarkOutlinedIcon style={{ fontSize: "50px" }} />, label: "Lost & Found" },      
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
            <div className="mt-10 ">
            <h2 className="text-3xl font-bold mb-4 text-[#28430d]">My Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myRequests.map((request) => (
                  <div key={request.id} className="p-4 text-white shadow-md rounded-3xl border border-gray-300 bg-[#28430d] ">
                    <h3 className="text-xl font-bold mb-2">{request.title}</h3>
                    <p className="text-white"><strong>Type:</strong> {request.type}</p>
                    {request.type === "Teammate" && (
                      <>
                        <p className="text-white"><strong>Description:</strong> {request.description}</p>
                        <p className="text-white"><strong>Requirement:</strong> {request.requirement}</p>
                        <p className="text-white"><strong>Teammate Type:</strong> {request.teammateType}</p>
                        <p className="text-white"><strong>Additional Info:</strong> {request.additionalInfo}</p>
                      </>
                    )}
                    {request.type === "Sports" && (
                      <>
                        <p className="text-white"><strong>Sport Name:</strong> {request.sportName}</p>
                        <p className="text-white"><strong>Date:</strong> {request.date}</p>
                        <p className="text-white"><strong>Time:</strong> {request.time}</p>
                        <p className="text-white"><strong>Venue:</strong> {request.venue}</p>
                        <p className="text-white"><strong>Additional Info:</strong> {request.additionalInfo}</p>
                        <p className="text-white"><strong>Participants:</strong> {request.participants}</p> {/* Added participants field */}
                      </>
                    )}
                    {(request.type === "Trips" || request.type === "Outing") && (
                      <>
                        <p className="text-white"><strong>Travelling From:</strong> {request.travellingFrom}</p>
                        <p className="text-white"><strong>Travelling To:</strong> {request.travellingTo}</p>
                        <p className="text-white"><strong>Time of Travel:</strong> {request.timeOfTravel}</p>
                        <p className="text-white"><strong>Travel Mode:</strong> {request.travelMode}</p>
                        <p className="text-white"><strong>Additional Info:</strong> {request.additionalInfo}</p>
                        <p className="text-white"><strong>Participants:</strong> {request.participants}</p> {/* Added participants field */}
                      </>
                    )}
                    {request.type === "Lost & Found" && (
                      <>
                        <p className="text-gray-700"><strong>Item Name:</strong> {request.itemName}</p>
                        <p className="text-gray-700"><strong>Item Description:</strong> {request.itemDescription}</p>
                        <p className="text-gray-700"><strong>Date Lost/Found:</strong> {request.dateLostFound}</p>
                        <p className="text-gray-700"><strong>Location Lost/Found:</strong> {request.locationLostFound}</p>
                        <p className="text-gray-700"><strong>Additional Info:</strong> {request.additionalInfo}</p>
                      </>
                    )}
                    {request.type === "Room-mates" && (
                      <>
                        <p className="text-white"><strong>Roommates Gender:</strong> {request.roommatesGender}</p>
                        <p className="text-white"><strong>Room Type Preference:</strong> {request.roomTypePreference}</p>
                        <p className="text-white"><strong>Hostel Tower:</strong> {request.hostelTower}</p>
                        <p className="text-white"><strong>Program/Year:</strong> {request.programYear}</p>
                        <p className="text-white"><strong>Additional Info:</strong> {request.additionalInfo}</p>
                      </>
                    )}
                    <p className="text-white mt-2"><strong>Created By:</strong> {request.createdByName}</p>
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
                  <div key={request.id} className="p-4 bg-[#28430d] shadow-md rounded-3xl border border-gray-300 text-white">
                    <h3 className="text-xl font-bold mb-2">{request.title}</h3>
                    <p><strong>Type:</strong> {request.type}</p>
                    {request.type === "Teammate" && (
                      <>
                        <p><strong>Description:</strong> {request.description}</p>
                        <p><strong>Requirement:</strong> {request.requirement}</p>
                        <p><strong>Teammate Type:</strong> {request.teammateType}</p>
                        <p><strong>Additional Info:</strong> {request.additionalInfo}</p>
                      </>
                    )}
                    {request.type === "Sports" && (
                      <>
                        <p><strong>Sport Name:</strong> {request.sportName}</p>
                        <p><strong>Date:</strong> {request.date}</p>
                        <p ><strong>Time:</strong> {request.time}</p>
                        <p><strong>Venue:</strong> {request.venue}</p>
                        <p><strong>Additional Info:</strong> {request.additionalInfo}</p>
                        <p><strong>Participants:</strong> {request.participants}</p> {/* Added participants field */}
                      </>
                    )}
                    {(request.type === "Trips" || request.type === "Outing") && (
                      <>
                        <p><strong>Travelling From:</strong> {request.travellingFrom}</p>
                        <p><strong>Travelling To:</strong> {request.travellingTo}</p>
                        <p><strong>Time of Travel:</strong> {request.timeOfTravel}</p>
                        <p><strong>Travel Mode:</strong> {request.travelMode}</p>
                        <p><strong>Additional Info:</strong> {request.additionalInfo}</p>
                        <p><strong>Participants:</strong> {request.participants}</p> {/* Added participants field */}
                      </>
                    )}
                    {request.type === "Lost & Found" && (
                      <>
                        <p ><strong>Item Name:</strong> {request.itemName}</p>
                        <p ><strong>Item Description:</strong> {request.itemDescription}</p>
                        <p ><strong>Date Lost/Found:</strong> {request.dateLostFound}</p>
                        <p ><strong>Location Lost/Found:</strong> {request.locationLostFound}</p>
                        <p ><strong>Additional Info:</strong> {request.additionalInfo}</p>
                      </>
                    )}
                    {request.type === "Room-mates" && (
                      <>
                        <p ><strong>Roommates Gender:</strong> {request.roommatesGender}</p>
                        <p ><strong>Room Type Preference:</strong> {request.roomTypePreference}</p>
                        <p ><strong>Hostel Tower:</strong> {request.hostelTower}</p>
                        <p ><strong>Program/Year:</strong> {request.programYear}</p>
                        <p ><strong>Additional Info:</strong> {request.additionalInfo}</p>
                      </>
                    )}
                    <p className=" mt-2"><strong>Created By:</strong> {request.createdByName}</p>
                    <button
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 item-bottom"
                      onClick={() => handleApply(request.id, request.userLimit, request.applicants)}
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
              <div className="mb-7"></div>
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
                  {selectedRequest === "Teammate" && (
                    <>
                      <label className="block text-white font-bold mb-2">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                        placeholder="Enter title"
                      />
                      <label className="block text-white font-bold mb-2">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                        placeholder="Describe your request"
                      ></textarea>
                      <label className="block text-white font-bold mb-2">Requirement</label>
                      <input
                        type="text"
                        name="skillsRequired"
                        value={formData.skillsRequired}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                        placeholder="Skills required"
                      />
                      <label className="block text-white font-bold mb-2">Teammate Type</label>
                      <select
                        name="teammateExpectations"
                        value={formData.teammateExpectations}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                      >
                        <option value="">Select type</option>
                        <option value="Academic">Academic</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Personal">Personal</option>
                        <option value="Collaborative">Collaborative</option>
                      </select>
                      <label className="block text-white font-bold mb-2">Additional Information</label>
                      <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                        placeholder="Additional information"
                      ></textarea>
                    </>
                  )}
                  {selectedRequest === "Sports" && (
                    <>
                      <label className="block text-white font-bold mb-2">Sport Name</label>
                      <select
                        name="sportName"
                        value={formData.sportName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                      >
                        <option value="">Select sport</option>
                        <option value="Football">Football</option>
                        <option value="Cricket">Cricket</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Tennis">Tennis</option>
                      </select>
                      <label className="block text-white font-bold mb-2">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                      />
                      <label className="block text-white font-bold mb-2">Time</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                      />
                      <label className="block text-white font-bold mb-2">Venue</label>
                      <input
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                        placeholder="Enter venue"
                      />
                      <label className="block text-white font-bold mb-2">Number of Participants</label>
                      <input
                        type="number"
                        name="participants"
                        value={formData.participants}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                        placeholder="Enter number of participants"
                      />
                      <label className="block text-white font-bold mb-2">Additional Information</label>
                      <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                        placeholder="Additional information"
                      ></textarea>
                    </>
                  )}
                 

{(selectedRequest === "Trips" || selectedRequest === "Outing") && (
  <>
    <label className="block text-white font-bold mb-2">Travelling From</label>
    <input
      type="text"
      name="travellingFrom"
      value={formData.travellingFrom}
      onChange={handleInputChange}
      className="w-full p-2 border rounded-md mb-4"
      placeholder="Enter starting point"
    />
    <label className="block text-white font-bold mb-2">Travelling To</label>
    <input
      type="text"
      name="travellingTo"
      value={formData.travellingTo}
      onChange={handleInputChange}
      className="w-full p-2 border rounded-md mb-4"
      placeholder="Enter destination"
    />
    <label className="block text-white font-bold mb-2">Time of Travel</label>
    <input
      type="time"
      name="timeOfTravel"
      value={formData.timeOfTravel}
      onChange={handleInputChange}
      className="w-full p-2 border rounded-md mb-4"
    />
    <label className="block text-white font-bold mb-2">Travel Mode</label>
    <input
      type="text"
      name="travelMode"
      value={formData.travelMode}
      onChange={handleInputChange}
      className="w-full p-2 border rounded-md mb-4"
      placeholder="Enter mode of travel"
    />
    <label className="block text-white font-bold mb-2">Number of Participants</label>
    <input
      type="number"
      name="participants"
      value={formData.participants}
      onChange={handleInputChange}
      className="w-full p-2 border rounded-md mb-4"
      placeholder="Enter number of participants"
    />
    <label className="block text-white font-bold mb-2">Maximum Participants</label>
    <input
      type="number"
      name="maxParticipants"
      value={formData.maxParticipants}
      onChange={handleInputChange}
      className="w-full p-2 border rounded-md mb-4"
      placeholder="Enter maximum number of participants"
    />
    <label className="block text-white font-bold mb-2">Additional Information</label>
    <textarea
      name="additionalInfo"
      value={formData.additionalInfo}
      onChange={handleInputChange}
      className="w-full p-2 border rounded-md mb-4"
      placeholder="Additional information"
    ></textarea>
  </>
)}
                  {selectedRequest === "Lost & Found" && (
                    <>
                      <label className="block text-white font-bold mb-2">Item Name</label>
                      <input
                        type="text"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                        placeholder="Enter item name"
                      />
                      <label className="block text-white font-bold mb-2">Item Description</label>
                      <textarea
                        name="itemDescription"
                        value={formData.itemDescription}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                        placeholder="Describe the item"
                      ></textarea>
                      <label className="block text-white font-bold mb-2">Date Lost/Found</label>
                      <input
                        type="date"
                        name="dateLostFound"
                        value={formData.dateLostFound}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                      />
                      <label className="block text-white font-bold mb-2">Location Lost/Found</label>
                      <input
                        type="text"
                        name="locationLostFound"
                        value={formData.locationLostFound}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                        placeholder="Enter location"
                      />
                      <label className="block text-white font-bold mb-2">Upload a Photo</label>
                      <input
                        type="file"
                        name="photo"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded-md mb-4"
                      />
                      <label className="block text-white font-bold mb-2">Additional Information</label>
                      <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                        placeholder="Additional information"
                      ></textarea>
                    </>
                  )}
                  {selectedRequest === "Room-mates" && (
                    <>
                      <label className="block text-white font-bold mb-2">Roommates Gender</label>
                      <select
                        name="roommatesGender"
                        value={formData.roommatesGender}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <label className="block text-white font-bold mb-2">Room Type Preference</label>
                      <select
                        name="roomTypePreference"
                        value={formData.roomTypePreference}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                      >
                        <option value="">Select room type</option>
                        <option value="2 Sharing">2 Sharing</option>
                        <option value="3 Sharing">3 Sharing</option>
                        <option value="4 Sharing">4 Sharing</option>
                      </select>
                      <label className="block text-white font-bold mb-2">Hostel Tower</label>
                      <input
                        type="text"
                        name="hostelTower"
                        value={formData.hostelTower}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                        placeholder="Enter hostel tower"
                      />
                      <label className="block text-white font-bold mb-2">Program/Year</label>
                      <input
                        type="text"
                        name="programYear"
                        value={formData.programYear}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                        placeholder="Enter program/year"
                      />
                      <label className="block text-white font-bold mb-2">Additional Information</label>
                      <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md mb-4"
                        placeholder="Additional information"
                      ></textarea>
                    </>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-md shadow hover:bg-green-700"
                  >
                    Submit Request
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <p className="text-2xl font-bold text-gray-700">
            Please log in to view and create requests.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;