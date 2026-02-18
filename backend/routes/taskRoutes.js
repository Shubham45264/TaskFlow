const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// ==========================================
// TASK ORCHESTRATION ROUTES
// Core workflows for workspace task management
// ==========================================

// Global Workspace view and Task creation
router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

// Specific Task lifecycle management
router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
