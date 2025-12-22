import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { Clock, DollarSign, Calendar, User, ArrowLeft, CheckCircle, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bid Form State
  const [bidAmount, setBidAmount] = useState('');
  const [days, setDays] = useState('');
  const [proposal, setProposal] = useState('');
  
  // Submission State
  const [workLink, setWorkLink] = useState('');
  const [notes, setNotes] = useState('');

  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setProject(data);
        
        if (user && data.createdBy._id === user._id) {
          const bidsRes = await api.get(`/bids/${id}`);
          setBids(bidsRes.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    if(id) fetchData();
  }, [id, user]);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/bids/${id}`, {
        bidAmount: bidAmount,
        daysToComplete: days,
        proposal: proposal
      });
      toast.success("Bid placed successfully!");
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place bid");
    }
  };

  const handleHire = async (bidId) => {
    if(!window.confirm("Hire this contractor? Funds will be locked.")) return;
    try {
      await api.post('/contracts', { bidId });
      toast.success("Contract Started!");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to hire.");
    }
  };

  // NEW: Submit Work Function
  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if(!window.confirm("Submit work for review?")) return;
    try {
      await api.post('/contracts/deliver', {
        projectId: id,
        workLink,
        notes
      });
      toast.success("Work Submitted! Payment pending approval.");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to submit work.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!project) return null;

  const isOwner = user && project.createdBy._id === user._id;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Link>
        
        {/* HEADER */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <span className="flex items-center mr-4"><User className="h-4 w-4 mr-1"/> {project.createdBy.name}</span>
                  <span className="flex items-center"><Calendar className="h-4 w-4 mr-1"/> Due {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                  project.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                  project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
              }`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            <div className="mt-8 prose max-w-none text-gray-700 whitespace-pre-line">
              {project.description}
            </div>
            <div className="mt-8 flex items-center gap-6 border-t pt-6">
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="text-2xl font-bold text-primary">${project.budget}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 1. BIDDING SECTION (Only if OPEN) */}
        {!isOwner && user.role === 'Contractor' && project.status === 'OPEN' && (
          <div className="bg-white shadow rounded-lg px-6 py-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Submit Your Proposal</h3>
            <form onSubmit={handlePlaceBid} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input type="number" required className="mt-1 block w-full border p-3 rounded" value={bidAmount} onChange={e => setBidAmount(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Days</label>
                  <input type="number" required className="mt-1 block w-full border p-3 rounded" value={days} onChange={e => setDays(e.target.value)} />
                </div>
              </div>
              <textarea 
                  required 
                  placeholder="Cover Letter..." 
                  className="w-full border p-3 rounded h-32"
                  value={proposal}
                  onChange={e => setProposal(e.target.value)}
              />
              <button type="submit" className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-800">Place Bid</button>
            </form>
          </div>
        )}

        {/* 2. SUBMIT WORK SECTION (Only if IN_PROGRESS and Contractor) */}
        {!isOwner && user.role === 'Contractor' && project.status === 'IN_PROGRESS' && (
           <div className="bg-white shadow rounded-lg px-6 py-8 border-l-4 border-blue-500">
             <h3 className="text-xl font-bold text-gray-900 mb-2">Active Contract</h3>
             <p className="text-gray-500 mb-6">This project is in progress. When you are done, submit your work here.</p>
             
             <form onSubmit={handleSubmitWork} className="space-y-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700">Project Link (GitHub/Drive)</label>
                 <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      <ExternalLink className="h-4 w-4" />
                    </span>
                    <input 
                      type="text" 
                      required 
                      className="flex-1 block w-full border border-gray-300 rounded-none rounded-r-md p-3 focus:ring-primary focus:border-primary" 
                      placeholder="https://github.com/..."
                      value={workLink}
                      onChange={e => setWorkLink(e.target.value)}
                    />
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700">Completion Notes</label>
                 <textarea 
                   required
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-primary focus:border-primary"
                   rows={3}
                   placeholder="Describe what you built..."
                   value={notes}
                   onChange={e => setNotes(e.target.value)}
                 />
               </div>
               <button type="submit" className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                 <CheckCircle className="h-5 w-5" /> Submit Work for Payment
               </button>
             </form>
           </div>
        )}

        {/* 3. AGENT VIEW (Bids) */}
        {isOwner && (
          <div className="bg-white shadow rounded-lg px-6 py-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Management Console</h3>
            {project.status === 'OPEN' ? (
                /* SHOW BIDS */
                bids.length === 0 ? <p className="text-gray-500">No bids yet.</p> : 
                bids.map(bid => (
                  <div key={bid._id} className="border p-4 rounded mb-4 flex justify-between items-center">
                     <div>
                        <h4 className="font-bold">{bid.contractor.name}</h4>
                        <p className="text-gray-600">{bid.proposal}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xl font-bold">${bid.bidAmount}</p>
                        <button onClick={() => handleHire(bid._id)} className="bg-green-600 text-white px-4 py-2 rounded mt-2">Hire Now</button>
                     </div>
                  </div>
                ))
            ) : project.status === 'IN_PROGRESS' ? (
                <div className="text-center py-8 bg-blue-50 rounded-lg border border-blue-100">
                    <Clock className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-blue-900">Work In Progress</h3>
                    <p className="text-blue-700">Contractor is currently working. You will be notified when they submit.</p>
                </div>
            ) : (
                <div className="text-center py-8 bg-green-50 rounded-lg border border-green-100">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-green-900">Project Completed</h3>
                    <p className="text-green-700">Work has been submitted and contract closed.</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
