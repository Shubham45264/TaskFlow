const mongoose = require('mongoose');

/**
 * TASK SCHEMA DEFINITION
 * Handles individual items within a project
 */
const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Todo', 'In Progress', 'Done'],
      default: 'Todo',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    dueDate: {
      type: Date,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project', // Link to the parent project
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // User assigned to work on this task
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // User who created the task
    }
  },
  {
    timestamps: true, // Auto-track creation/update
  }
);

module.exports = mongoose.model('Task', taskSchema);
