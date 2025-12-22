import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { ArrowLeft, Star, ListTodo, Square, CheckSquare, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Forms
  const [bidAmount, setBidAmount] = useState('');
  const [days, setDays] = useState('');
  const [proposal, setProposal] = useState('');
  const [workLink, setWorkLink] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Fetch Data Function
  const fetchProjectData = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
      
      if (user && data.createdBy._id === user._id) {
        const bidsRes = await api.get(`/bids/${id}`);
        setBids(bidsRes.data);
      }
      if (data.status === 'COMPLETED') {
          const reviewRes = await api.get(`/reviews/${id}`);
          setReviews(reviewRes.data);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id, user]);

  // --- ACTIONS (With Instant Updates) ---

  const handleToggleTask = async (itemId) => {
    try {
        const { data } = await api.patch(`/projects/${id}/checklist`, { itemId });
        setProject(data); // Updates checklist UI instantly
    } catch (error) { toast.error("Failed to update task"); }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to bid"); navigate('/login'); return; }
    
    try { 
      await api.post(`/bids/${id}`, { bidAmount, daysToComplete: days, proposal }); 
      toast.success("Bid placed!"); 
      fetchProjectData(); 
      setBidAmount(''); setDays(''); setProposal('');
    } catch (error) { toast.error("Failed to place bid"); }
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
    if(!window.confirm("Submit work and complete job?")) return;
    try { 
      await api.post('/contracts/deliver', { projectId: id, workLink, notes }); 
      toast.success("Work Submitted! Invoice Sent."); 
      setProject(prev => ({ ...prev, status: 'COMPLETED' }));
    } catch (error) { toast.error("Failed to submit."); }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try { 
      await api.post('/reviews', { projectId: id, rating, comment: reviewComment }); 
      toast.success("Review submitted!"); 
      fetchProjectData(); 
      setReviewComment('');
    } catch (error) { toast.error("Failed to submit review"); }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!project) return null;

  const isOwner = user && project.createdBy._id === user._id;
  const isContractor = user && !isOwner && user.role === 'Contractor';
  const allTasksCompleted = project.checklist && project.checklist.every(t => t.isCompleted);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Link>
        
        {/* Project Header Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-8">
            <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <div className="text-right">
                    <p className="text-2xl font-bold text-primary flex items-center justify-end gap-1">
                      <DollarSign className="h-6 w-6" />{project.budget}
                    </p>
                    <p className="text-sm text-gray-500">Budget</p>
                </div>
            </div>
            
            <div className="mt-4 flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                    project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Due: {new Date(project.deadline).toLocaleDateString()}
                </span>
            </div>

            <p className="mt-6 text-gray-700 whitespace-pre-wrap">{project.description}</p>

            {/* Checklist Section */}
            {project.checklist && project.checklist.length > 0 && (
                <div className="mt-8 bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <ListTodo className="h-5 w-5" /> Deliverables Checklist
                    </h3>
                    <div className="space-y-2">
                        {project.checklist.map(task => (
                            <div key={task._id} 
                                 className={`flex items-center p-3 bg-white rounded border transition-all ${
                                     task.isCompleted ? 'border-green-200 bg-green-50' : ''
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

        {/* 1. BIDDING SECTION (Contractor + OPEN) */}
        {isContractor && project.status === 'OPEN' && (
          <div className="bg-white shadow rounded-lg px-6 py-8">
            <h3 className="text-xl font-bold mb-4">Place a Bid</h3>
            <form onSubmit={handlePlaceBid} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bid Amount ($)</label>
                        <input type="number" className="w-full border p-2 rounded mt-1" value={bidAmount} onChange={e=>setBidAmount(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Days to Complete</label>
                        <input type="number" className="w-full border p-2 rounded mt-1" value={days} onChange={e=>setDays(e.target.value)} required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                    <textarea 
                        placeholder="Why are you the best fit?" 
                        className="w-full border p-2 rounded mt-1 resize-none overflow-hidden min-h-[80px]" 
                        value={proposal} 
                        onChange={e => {
                            setProposal(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }} 
                        required 
                    />
                </div>
                <button className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-800 transition-colors">Submit Bid</button>
            </form>
          </div>
        )}

        {/* 2. SUBMIT WORK SECTION (Contractor + IN_PROGRESS) */}
        {isContractor && project.status === 'IN_PROGRESS' && (
           <div className="bg-white shadow rounded-lg px-6 py-8 border-l-4 border-blue-500">
             <h3 className="text-xl font-bold mb-4">Submit Work</h3>
             {!allTasksCompleted && (
                 <div className="bg-yellow-50 text-yellow-800 p-3 rounded mb-4 text-sm flex items-center gap-2">
                    <ListTodo className="h-4 w-4" /> Please complete all checklist items above before submitting.
                 </div>
             )}
             <form onSubmit={handleSubmitWork} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700">Work Link / URL</label>
                  <input type="text" placeholder="e.g., GitHub repo, Google Drive link" className="w-full border p-2 rounded mt-1" value={workLink} onChange={e=>setWorkLink(e.target.value)} required />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea placeholder="Notes for the Agent..." className="w-full border p-2 rounded mt-1" value={notes} onChange={e=>setNotes(e.target.value)} required />
               </div>
               <button 
                  disabled={!allTasksCompleted}
                  className={`w-full py-3 rounded font-bold transition-colors ${
                      allTasksCompleted 
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-md' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
               >
                  {allTasksCompleted ? "Submit & Complete Job" : "Complete Checklist First"}
               </button>
             </form>
           </div>
        )}

        {/* 3. COMPLETED STATE (NEW: Shows submitted work) */}
        {project.status === 'COMPLETED' && (
            <div className="mb-8">
               <div className="bg-green-50 border border-green-200 shadow rounded-lg px-6 py-6 mb-8">
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-6 w-6" /> Work Completed & Paid
                  </h3>
                  <div className="space-y-2 text-green-800">
                      <p>The contractor has submitted the work and the invoice has been emailed to the agent.</p>
                      <p className="text-sm italic">Status: Funds Released</p>
                  </div>
               </div>

                <div className="bg-white shadow rounded-lg px-6 py-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Star className="text-yellow-400" /> Reviews</h3>
                    {reviews.length > 0 ? reviews.map(r => (
                        <div key={r._id} className="border p-4 rounded bg-gray-50 mb-4">
                            <div className="font-bold flex items-center gap-2">
                              {r.reviewer?.name || 'User'} 
                              <span className="text-yellow-500 text-sm flex">{'★'.repeat(r.rating)}</span>
                            </div>
                            <p className="text-gray-600 mt-1">"{r.comment}"</p>
                        </div>
                    )) : <p className="text-gray-500 italic">No reviews yet.</p>}
                    
                    {user && !reviews.some(r => r.reviewer?._id === user._id) && (
                        <form onSubmit={handleSubmitReview} className="mt-6 border-t pt-6 space-y-4">
                            <h4 className="font-bold text-gray-900">Leave a Review</h4>
                            <select value={rating} onChange={e=>setRating(Number(e.target.value))} className="border p-2 rounded w-full">
                                <option value="5">5 Stars - Excellent</option>
                                <option value="4">4 Stars - Good</option>
                                <option value="3">3 Stars - Average</option>
                                <option value="2">2 Stars - Poor</option>
                                <option value="1">1 Star - Terrible</option>
                            </select>
                            <textarea placeholder="Write a review..." className="w-full border p-2 rounded" value={reviewComment} onChange={e=>setReviewComment(e.target.value)} required />
                            <button className="bg-primary text-white px-6 py-2 rounded">Post Review</button>
                        </form>
                    )}
                </div>
            </div>
        )}

        {/* 4. AGENT VIEW: BIDS (OPEN) */}
        {isOwner && project.status === 'OPEN' && (
          <div className="bg-white shadow rounded-lg px-6 py-8 mt-8">
            <h3 className="text-xl font-bold mb-4">Received Bids ({bids.length})</h3>
            {bids.length === 0 ? <p className="text-gray-500 italic">No bids yet. Waiting for contractors...</p> :
              <div className="space-y-4">
                  {bids.map(bid => (
                    <div key={bid._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gray-50">
                       <div className="flex justify-between items-start mb-2">
                           <div>
                               <h4 className="font-bold text-lg text-gray-900">{bid.contractor.name}</h4>
                               <p className="text-xs text-gray-500">Applied on {new Date(bid.createdAt).toLocaleDateString()}</p>
                           </div>
                           <div className="text-right">
                               <span className="block text-2xl font-bold text-green-600">${bid.bidAmount}</span>
                               <span className="block text-sm text-gray-500">{bid.daysToComplete} Days delivery</span>
                           </div>
                       </div>
                       
                       <div className="bg-white p-3 rounded border border-gray-100 my-3 text-gray-700 italic">
                           "{bid.proposal}"
                       </div>

                       <div className="flex justify-end">
                           <button onClick={() => handleHire(bid._id)} className="bg-gray-900 text-white px-6 py-2 rounded font-medium hover:bg-black transition-colors shadow-sm">
                               Accept & Hire
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
