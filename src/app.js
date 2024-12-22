const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const otpRoutes = require("./routes/otpRoutes");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS for all routes
const corsConfig = {
  origin: "http://localhost:5173", // Allow only your frontend origin
  credentials: true, // Allow cookies or credentials
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
};

app.use(cors(corsConfig));

// Handle preflight OPTIONS requests
app.options("*", cors(corsConfig));

// Parse JSON requests
app.use(bodyParser.json());

// Routes
app.use("/api/otp", otpRoutes);

module.exports = app;