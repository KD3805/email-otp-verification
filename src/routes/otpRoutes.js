const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtpController } = require("../controllers/otpController");

// Routes
router.post("/send", sendOtp);
router.post("/verify", verifyOtpController);

module.exports = router;
