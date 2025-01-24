/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { auth, db } from "../src/firebase";
import { collection, getDocs, doc, deleteDoc, query, orderBy, addDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const adminEmails = ["daksh_vashishtha@srmap.edu.in", "admin2@srmap.edu.in"]; // Replace with your admin emails

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser && adminEmails.includes(currentUser.email)) {
        setUser(currentUser);
        fetchRequests();
      } else {
        navigate("/"); // Redirect non-admins to the home page
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchRequests = async () => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);  // Log the result to check the data
    const fetchedRequests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRequests(fetchedRequests);
  };

  const handleDelete = async (id, title) => {
    const reason = prompt("Why are you deleting this request?"); // Ask for the reason

    if (reason && window.confirm("Are you sure you want to delete this request?")) {
      try {
        // Delete the request
        await deleteDoc(doc(db, "requests", id));

        // Log the deletion along with the reason
        await addDoc(collection(db, "logs"), {
          action: "delete",
          requestId: id,
          title: title,
          deletedBy: user.email,
          timestamp: new Date(),
          reason: reason, // Store the reason
        });

        // Update state to reflect the deletion
        setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
        alert("Request deleted and logged successfully!");
      } catch (error) {
        console.error("Error deleting request: ", error);
        alert("Failed to delete request.");
      }
    }
  };

  const activeRequests = requests.filter((request) => !request.isOld);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Admin Dashboard</h1>

      {user ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Active Requests</h2>
            <Link
              to="/admin/logs"
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
            >
              View Logs
            </Link>
          </div>

          {/* Check if there are active requests */}
          {activeRequests.length === 0 ? (
            <p>No active requests available.</p>
          ) : (
            <div className="flex flex-wrap gap-4 justify-start">
              {activeRequests.map((request) => (
                <div key={request.id} className="p-4 bg-white shadow-md rounded-md border border-gray-300 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                  <h3 className="text-xl font-bold mb-2">{request.title}</h3>
                  <p className="text-gray-700"><strong>Type:</strong> {request.type}</p>
                  <p className="text-gray-700"><strong>Description:</strong> {request.description}</p>
                  <p className="text-gray-700"><strong>Skills Required:</strong> {request.skillsRequired}</p>
                  <p className="text-gray-700"><strong>Duration:</strong> {request.duration}</p>
                  <p className="text-gray-700"><strong>Created By:</strong> {request.createdByName}</p>

                  {/* Delete Button with Icon */}
                  <button
                    onClick={() => handleDelete(request.id, request.title)} 
                    className="mt-4 flex items-center justify-center bg-red-500 text-red-500 px-4 py-2 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    <DeleteOutlinedIcon className="mr-2 text-red-500" /> Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-xl text-center">Loading...</p>
      )}
    </div>
  );
};

export default Admin;
