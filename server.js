// --- server.js ---

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

// ✅ Load .env file
dotenv.config();

// ✅ Debug: show if dotenv loaded correctly
console.log("DEBUG: dotenv loaded, current working dir =", process.cwd());
console.log("DEBUG: env key =", process.env.OPENAI_API_KEY ? "✅ FOUND" : "❌ MISSING");

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;

// ✅ Chat endpoint
app.post("/chat", async (req, res) => {
  console.log("✅ Received message from frontend:", req.body);

  try {
    const userMessage = req.body.message;

    console.log("📤 Sending request to OpenAI API...");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();
    console.log("📥 OpenAI API response:", data);

    if (data.error) {
      console.error("❌ OpenAI API error:", data.error);
      return res.status(500).json({ error: "Error from OpenAI API" });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Error getting response" });
  }
});

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
