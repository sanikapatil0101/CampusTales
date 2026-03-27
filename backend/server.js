// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Allow frontend (React) requests

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/experience", require("./routes/experienceRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Default route
app.get("/", (req, res) => {
  res.send("CampusTales Backend is running");
});

// Port from .env or fallback
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
