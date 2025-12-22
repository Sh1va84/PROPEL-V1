const Contract = require('../models/Contract');
const Project = require('../models/Project');
const Bid = require('../models/Bid');
const { generateInvoice } = require('../utils/invoiceGenerator');
const sendEmail = require('../utils/emailService');

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

const deliverWork = async (req, res) => {
  try {
    const { projectId, workLink, notes } = req.body;
    const contract = await Contract.findOne({ 
      project: projectId, 
      contractor: req.user._id,
      status: 'ACTIVE'
    });

    if (!contract) return res.status(404).json({ message: 'No active contract found.' });

    contract.status = 'WORK_SUBMITTED'; 
    contract.workSubmission = { link: workLink, notes: notes };
    await contract.save();

    // FIX: Save the link to the Project model too!
    await Project.findByIdAndUpdate(projectId, { 
        status: 'WORK_SUBMITTED',
        workSubmissionLink: workLink 
    });

    res.json({ message: 'Work submitted! Waiting for client approval.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const releasePayment = async (req, res) => {
  try {
    let contract = await Contract.findById(req.params.id)
      .populate('project').populate('client').populate('contractor');
    
    if (!contract) {
       contract = await Contract.findOne({ project: req.params.id })
        .populate('project').populate('client').populate('contractor');
    }

    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    if (contract.client._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not Authorized' });
    }

    contract.status = 'COMPLETED';
    contract.escrowStatus = 'RELEASED';
    await contract.save();
    
    await Project.findByIdAndUpdate(contract.project._id, { status: 'COMPLETED' });

    // Try/Catch block prevents crashes if Email/PDF fails
    try {
        const invoicePdfBase64 = await generateInvoice(contract.terms, contract.contractor, contract.client);
        await sendEmail({
        email: contract.client.email, 
        subject: `Payment Receipt - ${contract.project.title}`,
        message: `You have released payment of $${contract.terms.amount}. Attached is your invoice.`,
        attachments: [{
            filename: `Invoice_${contract._id}.pdf`,
            content: invoicePdfBase64,
            encoding: 'base64'
        }]
        });
    } catch (emailErr) {
        console.log("Invoice email failed, but payment recorded.", emailErr);
    }

    res.json({ message: 'Payment released!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createContract, getMyContracts, deliverWork, releasePayment };
