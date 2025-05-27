const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateOTP = require('../utils/otpGenerator');
const sendOTP = require('../utils/mailer');
const jwt = require('jsonwebtoken');

// ➤ Send OTP on Signup
router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      otp,
      isVerified: false
    });

    await newUser.save();
    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent to email. Please verify." });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// ➤ Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp === otp) {
      user.isVerified = true;
      user.otp = null;
      await user.save();

      res.status(200).json({ message: "Email verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
});

// ➤ Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    res.status(200).json({ token, user: { email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;
