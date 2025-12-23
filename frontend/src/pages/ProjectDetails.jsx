import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { ArrowLeft, ListTodo, Square, CheckSquare, ExternalLink, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const [bidAmount, setBidAmount] = useState('');
  const [days, setDays] = useState('');
  const [proposal, setProposal] = useState('');
  const [workLink, setWorkLink] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setProject(data);
        if (user && data.createdBy._id === user._id) {
          const bidsRes = await api.get(`/bids/${id}`);
          setBids(bidsRes.data);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, [id, user]);

  const handleToggleTask = async (itemId) => {
    try {
        const { data } = await api.patch(`/projects/${id}/checklist`, { itemId });
        setProject(data); 
    } catch (error) { toast.error("Failed to update task"); }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to bid"); navigate('/login'); return; }
    try { await api.post(`/bids/${id}`, { bidAmount, daysToComplete: days, proposal }); toast.success("Bid placed!"); window.location.reload(); } 
    catch (error) { toast.error("Failed to place bid"); }
  };

  const handleHire = async (bidId) => {
    if(!window.confirm("Hire this contractor?")) return;
    try { 
      await api.post('/contracts', { bidId }); 
      toast.success("Hired Successfully!"); 
      setProject(prev => ({ ...prev, status: 'IN_PROGRESS' }));
    } catch (error) { toast.error("Failed to hire."); }
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if(!window.confirm("Submit work for review?")) return;
    try { await api.post('/contracts/deliver', { projectId: id, workLink, notes }); toast.success("Work Submitted for Review!"); window.location.reload(); } 
    catch (error) { toast.error("Failed to submit."); }
  };

  // --- INVOICE GENERATION LOGIC ---
  const handleReleasePayment = async () => {
     if(!window.confirm("Release Payment and Generate Invoice?")) return;
     
     setProcessingPayment(true); 
     try { 
        await api.put(`/contracts/${id}/pay`); 
        
        setProject(prev => ({ ...prev, status: 'COMPLETED' }));
        
        const contractorName = bids.find(b => b.status === 'ACCEPTED')?.contractor.name || 'Contractor';
        
        const invoiceText = `
================================================
          PROPEL PROPERTY MAINTENANCE
            OFFICIAL PAYMENT RECEIPT
================================================

TRANSACTION DETAILS:
--------------------
Date:           ${new Date().toLocaleDateString()}
Status:         PAID (Escrow Released)
Project ID:     ${project._id}

PROPERTY & WORK DETAILS:
------------------------
Issue:          ${project.title}
Amount Paid:    $${project.budget}
Category:       Maintenance / Repair

PARTICIPANTS:
------------------
From (Client):  ${user.name}
To (Trade):     ${contractorName}
------------------

Note: This is a computer-generated receipt.
Thank you for using PROPEL!
================================================
        `;
        
        const blob = new Blob([invoiceText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt_${project.title.replace(/\s+/g, '_')}.txt`;
        a.click();
        
        toast.success("Payment Released & Receipt Downloaded!");
     } 
     catch (error) { 
        toast.error("Failed to release payment"); 
     } finally {
        setProcessingPayment(false); 
     }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Project...</div>;
  if (!project) return null;

  const isOwner = user && project.createdBy._id === user._id;
  const isContractor = user && !isOwner && user.role === 'Contractor';
  const allTasksCompleted = project.checklist && project.checklist.every(t => t.isCompleted);
  const isWorkSubmitted = project.status === 'WORK_SUBMITTED';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Link>
        <div className="bg-white shadow-sm rounded-xl overflow-hidden mb-8 border border-gray-100">
          <div className="px-8 py-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                            project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 
                            project.status === 'WORK_SUBMITTED' ? 'bg-purple-100 text-purple-700' : 
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {project.status.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-500">Due: {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="text-right bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                    <p className="text-3xl font-bold text-gray-900">${project.budget}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Total Budget</p>
                </div>
            </div>
            <p className="mt-8 text-gray-700 leading-relaxed">{project.description}</p>
            {project.checklist && project.checklist.length > 0 && (
                <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <ListTodo className="h-5 w-5 text-gray-600" /> Deliverables Checklist
                    </h3>
                    <div className="space-y-3">
                        {project.checklist.map(task => (
                            <div key={task._id} 
                                 className={`flex items-center p-3 bg-white rounded-lg border transition-all ${
                                     task.isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                                 }`}
                                 onClick={() => (project.status === 'IN_PROGRESS' && isContractor) ? handleToggleTask(task._id) : null}
                                 style={{ cursor: (project.status === 'IN_PROGRESS' && isContractor) ? 'pointer' : 'default' }}
                            >
                                {task.isCompleted ? (
                                    <CheckSquare className="h-5 w-5 text-green-600 mr-3" />
                                ) : (
                                    <Square className="h-5 w-5 text-gray-300 mr-3" />
                                )}
                                <span className={`flex-1 ${task.isCompleted ? 'text-green-800 line-through' : 'text-gray-700'}`}>
                                    {task.text}
                                </span>
                            </div>
                        ))}
                    </div>
                    {project.status === 'IN_PROGRESS' && isContractor && (
                      <p className="text-xs text-gray-500 mt-2 text-right">Click items to mark as done</p>
                    )}
                </div>
            )}
          </div>
        </div>

        {isOwner && isWorkSubmitted && (
             <div className="bg-gradient-to-r from-purple-50 to-white shadow-md rounded-xl p-8 border border-purple-100 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldCheck className="w-32 h-32 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-purple-900">
                    <CheckCircle className="text-purple-600"/> Review Work Submission
                </h3>
                <p className="text-purple-700 mb-6 max-w-xl">The contractor has submitted the work. Please verify the deliverables before releasing the funds from escrow.</p>
                <div className="bg-white p-4 rounded-lg border border-purple-200 mb-6 flex items-center justify-between shadow-sm">
                    <span className="font-mono text-sm text-gray-600">Completion Photo/Doc</span>
                    <a href={project.workSubmissionLink || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 hover:underline">
                        View Proof <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
                <div className="flex gap-4 relative z-10">
                    <button 
                        onClick={handleReleasePayment}
                        disabled={processingPayment}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2"
                    >
                        {processingPayment ? (
                            <><Loader2 className="animate-spin h-5 w-5" /> Processing...</>
                        ) : (
                            "Approve Work & Release Payment"
                        )}
                    </button>
                    <button className="px-6 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors bg-white">
                        Request Revision
                    </button>
                </div>
             </div>
        )}

        {isContractor && isWorkSubmitted && (
             <div className="bg-purple-50 border border-purple-200 rounded-xl p-8 mb-8 text-center">
                 <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4">
                    <ShieldCheck className="h-8 w-8 text-purple-600" />
                 </div>
                 <h3 className="text-xl font-bold text-purple-900 mb-2">Work Submitted for Review</h3>
                 <p className="text-purple-700">The property manager has been notified. Funds will be released once they approve your work.</p>
             </div>
        )}

        {isContractor && project.status === 'OPEN' && (
          <div className="bg-white shadow rounded-xl px-8 py-8">
            <h3 className="text-xl font-bold mb-6">Submit a Quote</h3>
            <form onSubmit={handlePlaceBid} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quote Amount ($)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-400">$</span>
                            <input type="number" className="w-full border border-gray-300 pl-6 p-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" value={bidAmount} onChange={e=>setBidAmount(e.target.value)} required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time to Fix</label>
                        <div className="relative">
                            <input type="number" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" value={days} onChange={e=>setDays(e.target.value)} required />
                            <span className="absolute right-3 top-2 text-gray-400 text-sm">Days</span>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Repair Approach / Notes</label>
                    <textarea 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all min-h-[100px]" 
                        placeholder="Detail how you will fix the issue..."
                        value={proposal} 
                        onChange={e => setProposal(e.target.value)} 
                        required 
                    />
                </div>
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl">
                    Submit Quote
                </button>
            </form>
          </div>
        )}

        {isContractor && project.status === 'IN_PROGRESS' && (
           <div className="bg-white shadow-lg rounded-xl px-8 py-8 border-t-4 border-blue-600">
             <h3 className="text-xl font-bold mb-4">Complete Maintenance Job</h3>
             {!allTasksCompleted && (
                 <div className="bg-orange-50 text-orange-800 p-4 rounded-lg mb-6 text-sm flex items-center gap-3 border border-orange-100">
                    <ListTodo className="h-5 w-5"/>
                    You must complete all checklist items before submitting.
                 </div>
             )}
             <form onSubmit={handleSubmitWork} className="space-y-4">
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Proof of Work (Photo/Invoice Link)</label>
                   <input type="text" placeholder="https://drive.google.com/..." className="w-full border border-gray-300 p-2 rounded-lg" value={workLink} onChange={e=>setWorkLink(e.target.value)} required />
               </div>
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Completion Notes</label>
                   <textarea placeholder="Work details..." className="w-full border border-gray-300 p-2 rounded-lg min-h-[80px]" value={notes} onChange={e=>setNotes(e.target.value)} required />
               </div>
               <button 
                  disabled={!allTasksCompleted}
                  className={`w-full py-3 rounded-lg font-bold transition-all shadow-md ${
                      allTasksCompleted 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
               >
                  {allTasksCompleted ? "Submit for Approval" : "Complete Checklist First"}
               </button>
             </form>
           </div>
        )}

        {isOwner && project.status === 'OPEN' && (
          <div className="bg-white shadow rounded-xl px-8 py-8 mt-8">
            <h3 className="text-xl font-bold mb-6">Received Quotes ({bids.length})</h3>
            {bids.length === 0 ? <p className="text-gray-500 italic">No quotes yet.</p> :
              <div className="space-y-4">
                  {bids.map(bid => (
                    <div key={bid._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all bg-gray-50">
                       <div className="flex justify-between items-start mb-4">
                           <div>
                               <h4 className="font-bold text-lg text-gray-900">{bid.contractor.name}</h4>
                               <p className="text-xs text-gray-500">Quoted on {new Date(bid.createdAt).toLocaleDateString()}</p>
                           </div>
                           <div className="text-right">
                               <span className="block text-2xl font-bold text-green-600">${bid.bidAmount}</span>
                               <span className="block text-sm text-gray-500">{bid.daysToComplete} Days to fix</span>
                           </div>
                       </div>
                       <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 text-gray-700 italic">
                           "{bid.proposal}"
                       </div>
                       <div className="flex justify-end">
                           <button onClick={() => handleHire(bid._id)} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors shadow-sm">
                               Accept Quote & Assign
                           </button>
                       </div>
                    </div>
                  ))}
              </div>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
