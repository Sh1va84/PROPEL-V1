const Contract = require('../models/Contract');
const Project = require('../models/Project');
const Bid = require('../models/Bid');
const User = require('../models/User'); 
const { generateInvoice } = require('../utils/invoiceGenerator');
const sendEmail = require('../utils/emailService'); 

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

// Get MY Contracts
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

// DELIVER WORK & PROCESS PAYMENT
const deliverWork = async (req, res) => {
  try {
    const { projectId, workLink, notes } = req.body;
    
    // 1. Find the Contract
    const contract = await Contract.findOne({ 
      project: projectId, 
      contractor: req.user._id,
      status: 'ACTIVE'
    }).populate('client').populate('contractor');

    if (!contract) return res.status(404).json({ message: 'No active contract found.' });

    // 2. Save Work Details
    contract.status = 'COMPLETED'; 
    contract.escrowStatus = 'RELEASED'; 
    contract.submission = {
      workLink,
      notes,
      submittedAt: new Date()
    };
    await contract.save();

    // 3. Update Project Status
    await Project.findByIdAndUpdate(projectId, { status: 'COMPLETED' });

    // 4. TRANSFER FUNDS (Wallet Simulation)
    await User.findByIdAndUpdate(contract.client._id, { 
        $inc: { walletBalance: -contract.terms.amount } 
    });
    await User.findByIdAndUpdate(contract.contractor._id, { 
        $inc: { walletBalance: contract.terms.amount } 
    });

    // 5. GENERATE INVOICE PDF
    const invoiceData = {
        _id: contract._id,
        agreedAmount: contract.terms.amount
    };
    // Note: ensure generateInvoice in utils is set up correctly
    const pdfBase64 = await generateInvoice(invoiceData, contract.contractor, contract.client);

    // 6. EMAIL THE INVOICE
    await sendEmail({
      email: contract.client.email, // Send to Agent
      subject: `Work Delivered: ${contract._id}`,
      message: `Hello ${contract.client.name},\n\nThe contractor has submitted the work.\n\nLink: ${workLink}\nNotes: ${notes}\n\nPlease find the invoice attached.`,
      attachments: [
        {
            filename: `Invoice_${contract._id}.pdf`,
            content: pdfBase64,
            encoding: 'base64'
        }
      ]
    });

    res.json({ message: 'Work submitted, Payment released, and Invoice sent!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createContract, getMyContracts, deliverWork };
