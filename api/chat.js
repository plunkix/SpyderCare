const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import Google Generative AI

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your specific frontend URL
app.use(cors({
  origin: 'https://mindspaceai-srushti6226s-projects.vercel.app/' // Replace with your actual frontend URL
}));

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Middleware to parse JSON request bodies
app.use(express.json());

// Configure the generative model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are a therapist and your name is Spidey."
});

// Endpoint to handle chat requests
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Use the generative model to generate content
    const result = await model.generateContent([userMessage]);
    const botResponse = result.response.text(); // Get the response text

    // Debugging logs
    console.log(`User: ${userMessage}`);
    console.log(`Bot: ${botResponse}`);

    // Send the response back to the user
    res.json({ response: botResponse });

  } catch (error) {
    console.error('Error generating content with Gemini:', error.message);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
