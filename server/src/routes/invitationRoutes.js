const express = require('express');
const router = express.Router();
const {
  createInvitation,
  getContestInvitations,
  getReceivedInvitations,
  getSentInvitations,
  respondToInvitation,
  cancelInvitation,
  sendBulkInvitations,
} = require('../controllers/invitationController');

// Middleware for authentication - this would be implemented in a real app
// for now, let's create a simple middleware that simulates authentication
const authMiddleware = (req, res, next) => {
  // In a real application, this would verify a JWT token
  // For now, we'll use one of our seeded users (abhishek_photo)
  req.user = {
    id: '60f1a5c5e98f4a001c9b1234', // Seeded user ID - abhishek_photo
    username: 'abhishek_photo',
    email: 'abhishek@example.com',
    phone: '+919876543210',
  };
  next();
};

// Routes with authentication
router.post('/', authMiddleware, createInvitation);
router.get('/contest/:contestId', authMiddleware, getContestInvitations);
router.get('/received', authMiddleware, getReceivedInvitations);
router.get('/sent', authMiddleware, getSentInvitations);
router.put('/:id/respond', authMiddleware, respondToInvitation);
router.delete('/:id', authMiddleware, cancelInvitation);
router.post('/bulk', authMiddleware, sendBulkInvitations);

module.exports = router;
