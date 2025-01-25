import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 5000;

const HF_API_KEY = "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";  // Make sure you are using your actual Hugging Face API key
if (!HF_API_KEY) {
  console.error("Hugging Face API key is missing!");
  process.exit(1);
}

app.use(express.json());
app.use(cors());

app.post("/api/proxy", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing 'text' in request body" });
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/unitary/toxic-bert",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Parse response
    const predictions = response.data[0];  // Model returns an array with predictions
    console.log("Model Response:", predictions);

    // Extract the score for the toxic label
    const toxicScore = predictions[0].score || 0;
    
    // Set threshold for classifying as offensive
    const isOffensive = toxicScore > 0.5;  // Threshold can be adjusted

    // Return a simple boolean result
    res.json({ isOffensive });
  } catch (error) {
    console.error("Error in proxy server:", error.response?.data || error.message);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
