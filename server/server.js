const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Initialize the app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection string
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://suryanshgour:Suryansh@14@clustercampusconnect.doq2z.mongodb.net/campusconnectdata?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Define schema and model
const requestSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String, // Type of request (e.g., "Projects", "Competition")
  createdBy: String, // User ID of the creator
  applicants: [
    {
      userId: String, // User ID of the applicant
      name: String,   // Name of the applicant
      skills: String, // Skills provided during application
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Request = mongoose.model("Request", requestSchema);

// API routes

// Get all requests
app.get("/requests", async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new request
app.post("/requests", async (req, res) => {
  const { title, description, type, createdBy } = req.body;

  try {
    const newRequest = new Request({ title, description, type, createdBy });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Apply to a request
app.post("/requests/:id/apply", async (req, res) => {
  const { id } = req.params;
  const { userId, name, skills } = req.body;

  try {
    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    request.applicants.push({ userId, name, skills });
    await request.save();
    res.status(200).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
