const Task = require('../models/Task');
const Project = require('../models/Project');

// ==========================================
// FETCH ALL TASKS
// ==========================================
const getTasks = async (req, res) => {
  try {
    // Find projects owned by the user
    const userProjects = await Project.find({ owner: req.user.id }).select('_id');
    const projectIds = userProjects.map(p => p._id);

    // Retrieve tasks associated with user's projects or assigned to user
    const tasks = await Task.find({
      $or: [
        { project: { $in: projectIds } },
        { assignedTo: req.user.id },
        { created_by: req.user.id }
      ]
    }).populate('project', 'title').sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'We couldn\'t retrieve your tasks right now. Please try again later.' });
  }
};

// ==========================================
// CREATE NEW TASK
// ==========================================
const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, project_id, assigned_to } = req.body;

  if (!title || !project_id) {
    return res.status(400).json({ message: 'A task title and project identifier are required to proceed.' });
  }

  try {
    // Basic verification: user should have access to the project
    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(404).json({ message: 'The specified project could not be found.' });
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate,
      project: project_id,
      assignedTo: assigned_to || req.user.id,
      created_by: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong while creating your task. Please verify your data.' });
  }
};

// ==========================================
// UPDATE TASK DETAILS
// ==========================================
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'We couldn\'t find the task you\'re trying to update.' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Update failed. Please check if the provided information is valid.' });
  }
};

// ==========================================
// DELETE TASK
// ==========================================
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'The task you are looking for doesn\'t exist.' });
    }

    await task.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Task removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while trying to delete the task.' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
