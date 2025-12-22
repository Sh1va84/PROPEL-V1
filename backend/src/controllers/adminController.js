const User = require('../models/User');
const Project = require('../models/Project');
const Dispute = require('../models/Dispute');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
const getAdminStats = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    const projectCount = await Project.countDocuments();
    const disputeCount = await Dispute.countDocuments({ status: 'OPEN' });

    res.json({
      totalUsers: userCount,
      totalProjects: projectCount,
      activeDisputes: disputeCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ban a user
// @route   PUT /api/admin/users/:id/ban
const banUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Toggle ban status (implementation depends on if you want soft delete or a flag)
    // For this assignment, we will just delete them or flag them.
    // Let's add an 'isActive' flag to the User model schema later or just delete:
    await user.deleteOne(); 

    res.json({ message: 'User removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminStats, banUser };