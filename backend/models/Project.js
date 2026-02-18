const mongoose = require('mongoose');

/**
 * PROJECT SCHEMA DEFINITION
 * Manages project metadata and ownership
 */
const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User who created the project
    },
  },
  {
    timestamps: true, // Track creation and modification times
  }
);

module.exports = mongoose.model('Project', projectSchema);
