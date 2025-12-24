const express = require('express');
const { createContract, getMyContracts, deliverWork, releasePayment } = require('../controllers/contractController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createContract);
router.get('/my-contracts', protect, getMyContracts);
router.post('/deliver', protect, deliverWork);
router.put('/:id/pay', protect, releasePayment);

module.exports = router;

// NEW: Get contract for a specific project
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    const contract = await Contract.findOne({ project: req.params.projectId })
      .populate('project')
      .populate('client', 'name email')
      .populate('contractor', 'name email');
    
    if (!contract) {
      return res.status(404).json({ message: 'No contract found for this project' });
    }
    
    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
