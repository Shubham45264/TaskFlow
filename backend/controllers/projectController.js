const Project = require('../models/Project');
const Task = require('../models/Task');

// ==========================================
// FETCH ALL PROJECTS
// ==========================================
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'We were unable to load your projects. Please try refreshing.' });
  }
};

/**
 * FETCH SINGLE PROJECT
 */
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to view this project.' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(404).json({ message: 'Project not found.' });
  }
};

// ==========================================
// CREATE NEW PROJECT
// ==========================================
const setProject = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Every great project needs a title!' });
  }

  try {
    const project = await Project.create({
      title,
      description,
      owner: req.user.id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: 'We couldn\'t create your project. Please check the details and try again.' });
  }
};

// ==========================================
// UPDATE PROJECT DETAILS
// ==========================================
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Verify ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'You don\'t have permission to modify this project.' });
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: 'Update failed. Something went wrong.' });
  }
};

// ==========================================
// DELETE PROJECT (CASCADE TASKS)
// ==========================================
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'You don\'t have permission to remove this project.' });
    }

    // Cascade delete: remove all tasks associated with this project
    await Task.deleteMany({ project: req.params.id });

    // Now delete the project itself
    await project.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Project and all its tasks have been removed.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while attempting to delete the project.' });
  }
};

module.exports = {
  getProjects,
  getProject,
  setProject,
  updateProject,
  deleteProject,
};
