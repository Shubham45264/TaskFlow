const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  setProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// ==========================================
// PROJECT GOVERNANCE ROUTES
// All endpoints in this module require JWT protection
// ==========================================

// Collection Root: List and Initialization
router.route('/')
  .get(protect, getProjects)
  .post(protect, setProject);

// Instance Hub: Modification and Decommissioning
router.route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
