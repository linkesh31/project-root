const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
