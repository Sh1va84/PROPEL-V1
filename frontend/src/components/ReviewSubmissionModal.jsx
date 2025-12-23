import React, { useState } from 'react';
import axios from 'axios';

const ReviewSubmissionModal = ({ jobId, onClose, onRefresh }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [proofDoc, setProofDoc] = useState(""); 

  const handleApprove = async () => {
    setIsProcessing(true); // Start Spinner

    try {
      // MAKE SURE THIS URL MATCHES YOUR BACKEND ROUTE
      const res = await axios.post(`http://localhost:5000/api/projects/release-funds`, {
        jobId: jobId,
        proofUrl: proofDoc
      });

      if (res.data.success) {
        alert("Funds Released Successfully!");
        if (onRefresh) onRefresh();
        if (onClose) onClose();
      }

    } catch (error) {
      console.error("Error releasing funds:", error);
      alert(error.response?.data?.message || "Server connection failed.");

    } finally {
      // CRITICAL FIX: This stops the spinner even if the server hangs or errors
      setIsProcessing(false); 
    }
  };

  return (
    <div className="modal-content">
      <h3>Review Work Submission</h3>
      <p>The contractor has submitted the work. Please verify deliverables.</p>

      <div style={{ marginBottom: "15px" }}>
        <input 
          type="text" 
          value={proofDoc} 
          onChange={(e) => setProofDoc(e.target.value)}
          placeholder="Completion Photo/Doc URL" 
          className="form-control"
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <div className="actions">
        <button 
          onClick={handleApprove} 
          disabled={isProcessing}
          style={{ background: "#28a745", color: "white", padding: "10px 20px", border: "none", cursor: "pointer" }}
        >
          {isProcessing ? "Processing..." : "Approve & Release Funds"}
        </button>

        <button 
          onClick={onClose}
          disabled={isProcessing}
          style={{ marginLeft: "10px", padding: "10px 20px", cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmissionModal;
