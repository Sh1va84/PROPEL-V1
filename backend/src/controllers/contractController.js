const Contract = require('../models/Contract');
const Project = require('../models/Project');
const Bid = require('../models/Bid');

// Hire Contractor
const createContract = async (req, res) => {
  try {
    const { bidId } = req.body;
    const bid = await Bid.findById(bidId).populate('project');
    if (!bid) return res.status(404).json({ message: 'Bid not found' });

    if (bid.project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const contract = await Contract.create({
      project: bid.project._id,
      client: req.user._id,
      contractor: bid.contractor,
      bid: bid._id,
      terms: { amount: bid.bidAmount, days: bid.daysToComplete }
    });

    await Project.findByIdAndUpdate(bid.project._id, { status: 'IN_PROGRESS' });
    await Bid.findByIdAndUpdate(bidId, { status: 'ACCEPTED' });

    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get MY Contracts (The Missing Link!)
const getMyContracts = async (req, res) => {
  try {
    const contracts = await Contract.find({ contractor: req.user._id })
      .populate('project')
      .populate('client', 'name email');
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deliver Work
const deliverWork = async (req, res) => {
  try {
    const { projectId, workLink, notes } = req.body;
    const contract = await Contract.findOne({ 
      project: projectId, 
      contractor: req.user._id,
      status: 'ACTIVE'
    });

    if (!contract) return res.status(404).json({ message: 'No active contract found.' });

    contract.status = 'COMPLETED'; 
    contract.escrowStatus = 'RELEASED'; 
    await contract.save();

    await Project.findByIdAndUpdate(projectId, { status: 'COMPLETED' });

    res.json({ message: 'Work submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createContract, getMyContracts, deliverWork };
