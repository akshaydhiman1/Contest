const express = require('express');
const router = express.Router();
const {
  createContest,
  getContests,
  getContest,
  updateContest,
  deleteContest,
  getUserContests,
  getParticipatingContests,
} = require('../controllers/contestController');

// Middleware for authentication - same as in invitationRoutes
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

// Note: Route order matters! Specific routes should come before parameter routes
// User-specific routes
router.get('/user/created', authMiddleware, getUserContests);
router.get('/user/participating', authMiddleware, getParticipatingContests);

// Standard CRUD routes
router.post('/', authMiddleware, createContest);
router.get('/', authMiddleware, getContests);
router.get('/:id', authMiddleware, getContest);
router.put('/:id', authMiddleware, updateContest);
router.delete('/:id', authMiddleware, deleteContest);

module.exports = router;
