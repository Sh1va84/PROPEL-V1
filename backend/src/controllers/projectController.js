const Project = require('../models/Project');
const Contract = require('../models/Contract');

// Create a new project
const createProject = async (req, res) => {
  try {
    const { title, description, budget, deadline, requiredSkills, checklist } = req.body;
    
    const project = await Project.create({
      title,
      description,
      budget,
      deadline,
      requiredSkills,
      checklist,
      createdBy: req.user._id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}) // Fetch ALL projects
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single project details
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!project) return res.status(404).json({ message: 'Project not found' });

    let submissionData = null;
    if (project.status === 'COMPLETED') {
        const contract = await Contract.findOne({ project: project._id });
        if (contract && contract.submission) {
            submissionData = contract.submission;
        }
    }

    res.json({ ...project.toObject(), submission: submissionData });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Checklist Item
const updateChecklistItem = async (req, res) => {
    try {
        const { itemId } = req.body;
        const project = await Project.findById(req.params.id);
        
        const item = project.checklist.id(itemId);
        if(item) {
            item.isCompleted = !item.isCompleted;
            await project.save();
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: "Failed to update checklist" });
    }
};

// Delete Project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is the owner
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    
    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, updateChecklistItem, deleteProject };