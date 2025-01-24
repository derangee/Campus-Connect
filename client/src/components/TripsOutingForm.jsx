import { useState } from "react";
import { db } from "../firebase"; // Adjust path if needed
import { collection, addDoc } from "firebase/firestore";

const TripsOutingForm = ({ closeForm }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: "",
    date: "",
    participants: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add form data to the "trips" collection in Firestore
      await addDoc(collection(db, "trips"), {
        ...formData,
        date: new Date(formData.date).toISOString(), // Convert date to ISO format
        participants: Number(formData.participants), // Ensure participants is a number
      });
      console.log("Trip request added successfully!");
      closeForm(); // Close the form after successful submission
    } catch (error) {
      console.error("Error adding trip request: ", error);
    }
  };

  return (
    <div className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-[#28430d] p-6">
      <button
        onClick={closeForm}
        className="text-white font-bold text-xl absolute top-4 right-4"
      >
        &times;
      </button>
      <h2 className="text-2xl text-white font-bold mb-4">
        Create a Trip/Outing Request
      </h2>
      <form onSubmit={handleSubmit}>
        <label className="block text-white font-bold mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <label className="block text-white font-bold mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <label className="block text-white font-bold mb-2">Destination</label>
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <label className="block text-white font-bold mb-2">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <label className="block text-white font-bold mb-2">Participants</label>
        <input
          type="number"
          name="participants"
          value={formData.participants}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default TripsOutingForm;
