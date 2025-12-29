const Bid = require('../models/Bid');
const Project = require('../models/Project');

// Place a new Bid
const placeBid = async (req, res) => {
  try {
    // 1. Get data from Frontend
    // We handle BOTH naming conventions just to be safe
    const amount = req.body.bidAmount || req.body.amount;
    const days = req.body.daysToComplete || req.body.days;
    const proposal = req.body.proposal;

    if (!amount || !days || !proposal) {
      return res.status(400).json({ message: 'Missing required fields (Amount, Days, or Proposal)' });
    }

    // 2. Create the Bid Object matching the Model
    const bid = await Bid.create({
      project: req.params.projectId,
      contractor: req.user._id,
      bidAmount: amount,          // Mapping correctly to Model
      daysToComplete: days,       // Mapping correctly to Model
      proposal: proposal
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Bids for a specific Project (WITH AUTHORIZATION)
const getBids = async (req, res) => {
  try {
    // First, find the project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if the user is the project owner
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view bids' });
    }
    
    const bids = await Bid.find({ project: req.params.projectId })
      .populate('contractor', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeBid, getBids };