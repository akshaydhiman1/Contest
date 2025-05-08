const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '_id phone otp').select('+otp');
    console.log('All users in database:', users);
    res.status(200).json({success: true, data: users});
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({success: false, message: 'Failed to fetch users'});
  }
});

// Route to verify phone number and OTP
router.post('/verify-otp', async (req, res) => {
  const {phone, otp} = req.body;
  console.log('Verifying OTP - Phone:', phone, 'OTP:', otp);

  try {
    // First check if user exists
    const user = await User.findOne({phone}).select('+otp');
    console.log('User found:', user);

    if (!user) {
      console.log('User not found with phone:', phone);
      return res.status(404).json({
        success: false,
        message: 'User not found with this phone number'
      });
    }

    // Check if OTP matches
    if (user.otp === otp) {
      console.log('OTP verified successfully');
      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully'
      });
    } else {
      console.log('Invalid OTP provided');
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
});

// Route to verify if a phone number exists
router.post('/verify-phone', async (req, res) => {
  const {phone} = req.body;
  console.log('Verifying phone number:', phone);

  try {
    // First, let's check all users in the database
    const allUsers = await User.find({}, 'phone');
    console.log('All users in database:', allUsers);

    const user = await User.findOne({phone}).select('+otp');
    console.log('Found user:', user);

    if (user) {
      // For testing, generate a hardcoded OTP
      user.otp = '123456';
      await user.save();
      console.log('Set OTP for user:', user.otp);
      
      return res.status(200).json({
        success: true,
        message: 'Phone number exists',
        otp: user.otp
      });
    } else {
      console.log('Phone number not found in database');
      return res.status(404).json({
        success: false,
        message: 'Phone number not found. Please try one of these test numbers:\n+919876543210 (John Doe)\n+919876543211 (Jane Smith)\n+919876543212 (Mike Johnson)'
      });
    }
  } catch (error) {
    console.error('Error verifying phone number:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify phone number'
    });
  }
});

module.exports = router;
