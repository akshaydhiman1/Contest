const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '_id phone otp');
    res.status(200).json({success: true, data: users});
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({success: false, message: 'Failed to fetch users'});
  }
});

// Route to verify phone number and OTP
router.post('/verify-otp', async (req, res) => {
  const {phone, otp} = req.body;

  try {
    const user = await User.findOne({phone, otp});

    if (user) {
      return res
        .status(200)
        .json({success: true, message: 'OTP verified successfully'});
    } else {
      return res
        .status(400)
        .json({success: false, message: 'Invalid phone number or OTP'});
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res
      .status(500)
      .json({success: false, message: 'Failed to verify OTP'});
  }
});

// Route to verify if a phone number exists
router.post('/verify-phone', async (req, res) => {
  const {phone} = req.body;

  try {
    const user = await User.findOne({phone});

    if (user) {
      // For testing, generate a hardcoded OTP (e.g., '123456')
      user.otp = '123456';
      await user.save();
      return res
        .status(200)
        .json({success: true, message: 'Phone number exists', otp: user.otp});
    } else {
      return res
        .status(404)
        .json({success: false, message: 'Phone number not found'});
    }
  } catch (error) {
    console.error('Error verifying phone number:', error);
    return res
      .status(500)
      .json({success: false, message: 'Failed to verify phone number'});
  }
});

module.exports = router;
