const express = require('express');
const { createProject, getProjects, getProjectById, deleteProject, toggleChecklist } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware'); // <--- IMPORT FROM ROLE MIDDLEWARE

const router = express.Router();

router.route('/')
  .post(protect, authorize('Agent', 'Admin'), createProject)
  .get(getProjects);

router.route('/:id')
  .get(getProjectById)
  .delete(protect, deleteProject);

// NEW Route for toggling tasks
router.route('/:id/checklist').patch(protect, toggleChecklist);

module.exports = router;
