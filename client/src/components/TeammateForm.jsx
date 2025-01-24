import { useState } from "react";

const TeammateForm = ({ closeForm }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirement: "",
    teammateType: "",
    additionalInfo: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit formData to Firebase
    console.log(formData);
    closeForm();
  };

  return (
    <div className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-[#28430d] p-6">
      <button onClick={closeForm} className="text-white font-bold text-xl absolute top-4 right-4">
        &times;
      </button>
      <h2 className="text-2xl text-white font-bold mb-4">Create a Teammate Request</h2>
      <form onSubmit={handleSubmit}>
        <label className="block text-white font-bold mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block text-white font-bold mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block text-white font-bold mb-2">Requirement</label>
        <input
          type="text"
          name="requirement"
          value={formData.requirement}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block text-white font-bold mb-2">Teammate Type</label>
        <select
          name="teammateType"
          value={formData.teammateType}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Select</option>
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
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default TeammateForm;
