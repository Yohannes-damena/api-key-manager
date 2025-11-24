import Project from '../models/Project.js';
import User from '../models/User.js';

export const createProject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = new Project({
      name: name.trim(),
      owner: req.user._id,
    });

    await project.save();

    // Add project to user's projects array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { projects: project._id },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Server error creating project' });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id })
      .populate('keys')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error fetching projects' });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    })
      .populate('keys')
      .populate('owner', 'email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error fetching project' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Remove project from user's projects array
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { projects: project._id },
    });

    // Delete project (this will cascade delete keys via middleware if configured)
    await Project.findByIdAndDelete(project._id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Server error deleting project' });
  }
};

