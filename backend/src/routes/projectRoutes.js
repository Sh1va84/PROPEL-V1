const express = require('express');
const { createProject, getProjects, getProjectById, updateChecklistItem, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Simple Routes: Get All & Create
router.route('/')
  .get(getProjects)
  .post(protect, createProject);

// Single Project Operations
router.route('/:id')
  .get(getProjectById)
  .delete(protect, deleteProject); // DELETE ROUTE ADDED

router.patch('/:id/checklist', protect, updateChecklistItem);

module.exports = router;