const Otp = require("../models/OtpModel");
const crypto = require("crypto");

// Generate and Save OTP
const generateAndSaveOtp = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  // Save OTP to database, overwrite existing entry if email already exists
  await Otp.findOneAndUpdate(
    { email },
    { otp, createdAt: Date.now() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return otp;
};

// Verify OTP
const verifyOtp = async (email, otp) => {
  const record = await Otp.findOne({ email, otp });
  return record;
};

// Delete OTP after successful verification
const deleteOtp = async (email) => {
  await Otp.deleteOne({ email });
};

module.exports = {
  generateAndSaveOtp,
  verifyOtp,
  deleteOtp,
};
