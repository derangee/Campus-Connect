import express from "express";
import cors from "cors";
import { checkProfanity } from "./server/proxy.mjs"; // Correct import for your proxy.mjs

const app = express();
app.use(cors());
app.use(express.json());

// Define the /api/proxy endpoint
app.post("/api/proxy", async (req, res) => {
  const { text } = req.body;

  try {
    const isOffensive = await checkProfanity(text); // Call the profanity check function
    res.status(200).json({ isOffensive });
  } catch (error) {
    console.error("Error in /api/proxy:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
