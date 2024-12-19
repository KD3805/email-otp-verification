const {
  generateAndSaveOtp,
  verifyOtp,
  deleteOtp,
} = require("../services/otpService");
const nodemailer = require("nodemailer");

// Email Transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email template with custom design
const emailTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background: #f7f7f7;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;
    }
    .email-header {
      text-align: center;
      padding: 10px 0;
      background-color: #007BFF;
      color: #fff;
      font-size: 24px;
      border-radius: 8px;
    }
    .email-body {
      margin: 20px 0;
      text-align: center;
    }
    .otp {
      font-size: 36px;
      font-weight: bold;
      color: #007BFF;
      margin: 10px 0;
    }
    .email-footer {
      text-align: center;
      font-size: 14px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      Blood Bank Management System
    </div>
    <div class="email-body">
      <p>Dear User,</p>
      <p>Here is your One-Time Password (OTP) to verify your email:</p>
      <div class="otp">${otp}</div>
      <p>Please use this OTP to complete your verification process. The OTP is valid for the next 5 minutes.</p>
    </div>
    <div class="email-footer">
      © 2024 ● Blood Bank Management System. All Rights Reserved.
    </div>
  </div>
</body>
</html>
`;

// Send OTP Controller
const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const otp = await generateAndSaveOtp(email);

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Red Vault OTP Code",
      html: emailTemplate(otp), // Use the HTML template here
    });

    res.status(200).json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// Verify OTP Controller
const verifyOtpController = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  try {
    const record = await verifyOtp(email, otp);

    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Delete OTP after successful verification
    await deleteOtp(email);

    res.status(200).json({ success: true, message: "OTP verified successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};

module.exports = { sendOtp, verifyOtpController };
