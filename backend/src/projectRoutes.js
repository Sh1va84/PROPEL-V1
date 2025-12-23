const express = require('express');
const router = express.Router();
// ADJUST THIS PATH to point to your actual Job/Project model
const Job = require('../models/Job'); 

// Route: POST /api/projects/release-funds
router.post('/release-funds', async (req, res) => {
  try {
    const { jobId, proofUrl } = req.body;

    // 1. Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // 2. Update status
    job.status = 'Completed';
    job.proofUrl = proofUrl;
    await job.save();

    // 3. CRITICAL FIX: Send a response so the frontend stops waiting
    res.status(200).json({ 
      success: true, 
      message: "Funds released successfully" 
    });

  } catch (error) {
    console.error("Backend Error:", error);
    // 4. CRITICAL FIX: Send error response
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
});

module.exports = router;
