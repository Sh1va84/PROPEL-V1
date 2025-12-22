const Project = require('../models/Project');

// Create Project (Now accepts checklist)
const createProject = async (req, res) => {
  try {
    const { title, description, budget, deadline, requiredSkills, visibility, checklist } = req.body;
    
    const project = await Project.create({
      title,
      description,
      budget,
      deadline,
      requiredSkills,
      visibility,
      checklist: checklist || [], // Save the list
      createdBy: req.user._id,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'name email role');
    res.json(projects);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy', 'name email');
    if (project) res.json(project);
    else res.status(404).json({ message: 'Project not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    if (project.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await project.deleteOne();
    res.json({ message: 'Removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// NEW: Toggle Checklist Item
const toggleChecklist = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const item = project.checklist.id(req.body.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Toggle the value
    item.isCompleted = !item.isCompleted;
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, deleteProject, toggleChecklist };
