const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ==========================================
// USER REGISTRATION
// ==========================================
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Welcome! Please provide your name, email, and a secure password to get started.' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists. Try signing in instead?' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'member'
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Something went wrong during registration. Please try again.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error. Our team is looking into it!' });
  }
};

// ==========================================
// USER LOGIN
// ==========================================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password to access your workspace.' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'The email or password you entered is incorrect. Please try again.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed. Please check your connection.' });
  }
};

// ==========================================
// AUTHENTICATED USER DATA
// ==========================================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve profile data.' });
  }
};

// ==========================================
// UPDATE USER PROFILE
// ==========================================
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      // We don't allow email updates in this version for simplicity and security

      const updatedUser = await user.save();

      res.status(200).json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user profile' });
  }
};

// ==========================================
// UPDATE USER PASSWORD
// ==========================================
const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user && (await user.matchPassword(req.body.currentPassword))) {
      user.password = req.body.newPassword;
      await user.save();
      res.status(200).json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update password' });
  }
};

// ==========================================
// JWT GENERATION HELPER
// ==========================================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  updatePassword,
};
