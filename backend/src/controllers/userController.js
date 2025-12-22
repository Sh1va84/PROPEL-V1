const User = require('../models/User');

// @desc    Get user profile (Public)
// @route   GET /api/users/:id
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      
      // Update specific fields based on role
      if (user.role === 'Contractor') {
        user.profile.skills = req.body.skills || user.profile.skills;
        user.profile.portfolio = req.body.portfolio || user.profile.portfolio; // expecting array of URLs
        user.profile.hourlyRate = req.body.hourlyRate || user.profile.hourlyRate;
        user.profile.bio = req.body.bio || user.profile.bio;
      }
      
      if (user.role === 'Agent') {
        user.companyName = req.body.companyName || user.companyName;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        role: updatedUser.role,
        profile: updatedUser.profile,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateUserProfile };