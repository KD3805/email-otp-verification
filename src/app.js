// src/app.js
const express = require("express");
const bodyParser = require("body-parser");
const otpRoutes = require("./routes/otpRoutes");
const cors = require('cors');
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS for all routes
const corsConfig = {
    origin: "*",
    credential: true,
    methods: ["GET", "PUT", "POST", "DELETE"],  // optionally specify which methods are allowed
};
app.use(cors(corsConfig));  
app.options("", cors(corsConfig)); 

// Parse JSON requests
app.use(bodyParser.json()); 

// Routes
app.use("/api/otp", otpRoutes);

module.exports = app;
