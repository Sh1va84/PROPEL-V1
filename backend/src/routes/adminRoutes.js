const express = require('express');
const router = express.Router();
const { getAdminStats, banUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes here require Admin role
router.get('/stats', protect, authorize('Admin'), getAdminStats);
router.put('/users/:id/ban', protect, authorize('Admin'), banUser);

module.exports = router;