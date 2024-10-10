require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your frontend domain
const corsOptions = {
    origin: 'https://mindspaceai.vercel.app', // Replace this with your actual frontend URL
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Middleware to parse JSON request bodies
app.use(express.json());

// Configure the generative model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Endpoint to handle chat requests
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Use the generative model to generate content
    const result = await model.generateContent([userMessage]);

    // Check if the result contains the correct field
    if (result && result.response) {
        const botResponse = result.response; // No need for .text() if it's already text
        res.json({ response: botResponse });
    } else {
        throw new Error('Invalid response structure from Gemini API');
    }

    // Debugging logs
    console.log(`User: ${userMessage}`);
    console.log(`Bot: ${botResponse}`);

  } catch (error) {
    console.error('Error generating content with Gemini:', error.message);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
