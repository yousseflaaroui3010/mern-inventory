// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/debug', getAllUsers); // Debug route to check users

// Protected routes
router.get('/profile', protect, getUserProfile);

module.exports = router;