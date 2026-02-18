const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  updatePassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// ==========================================
// PUBLIC USER ENDPOINTS
// ==========================================
router.post('/register', registerUser);
router.post('/login', loginUser);

// ==========================================
// PROTECTED USER PROFILE ENDPOINTS
// ==========================================
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUser);
router.put('/profile/password', protect, updatePassword);

module.exports = router;
