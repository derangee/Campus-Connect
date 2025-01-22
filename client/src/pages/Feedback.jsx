import React, { useState } from "react";
import { db, auth } from "../firebase"; // Import Firebase config
import { collection, addDoc } from "firebase/firestore"; // Firestore methods
import { useAuthState } from "react-firebase-hooks/auth"; // For current user authentication state

const Feedback = () => {
  const [issueFeedback, setIssueFeedback] = useState("");
  const [improvementFeedback, setImprovementFeedback] = useState("");
  const [user] = useAuthState(auth);

  const handleSubmit = async () => {
    if (!user) {
      alert("Please log in to submit feedback.");
      return;
    }

    if (!issueFeedback.trim() || !improvementFeedback.trim()) {
      alert("Please provide feedback for both questions.");
      return;
    }

    try {
      // Add feedback to Firestore
      await addDoc(collection(db, "feedback"), {
        userId: user.uid,
        userEmail: user.email,
        issueFeedback: issueFeedback.trim(),
        improvementFeedback: improvementFeedback.trim(),
        submittedAt: new Date(),
      });

      alert("Feedback submitted successfully!");
      setIssueFeedback(""); // Reset fields
      setImprovementFeedback("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("There was an error submitting your feedback. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 rounded-lg shadow-lg max-w-lg w-full bg-[#4d6b2c] text-white">
        <h1 className="text-2xl font-bold text-center mb-6">
          We value your opinion
        </h1>

        {/* Question 1: Issue Feedback */}
        <div className="mb-6">
          <p>Let us know if you’ve encountered any problems or difficulties:</p>
          <textarea
            value={issueFeedback}
            onChange={(e) => setIssueFeedback(e.target.value)}
            className="w-full h-24 mt-2 p-2 border border-gray-500 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Describe your issue..."
          ></textarea>
        </div>

        {/* Question 2: Improvement Feedback */}
        <div className="mb-6">
          <p> What improvements would you suggest:</p>
          <textarea
            value={improvementFeedback}
            onChange={(e) => setImprovementFeedback(e.target.value)}
            className="w-full h-24 mt-2 p-2 border border-gray-500 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Your suggestions..."
          ></textarea>
        </div>

        {/* Contact Info */}
        <div className="mb-6">
          <p>
            If you have any issue, please feel free to contact:{" "}
            <span className="font-bold">campusconnect@srmap.edu.in</span>
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition focus:ring focus:ring-blue-300"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Feedback;
