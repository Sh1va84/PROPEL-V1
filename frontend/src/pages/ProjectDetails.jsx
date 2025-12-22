import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { Clock, DollarSign, Calendar, User, ArrowLeft, CheckCircle, ExternalLink, Star, ListTodo, Square, CheckSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
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

  useEffect(() => {
    const fetchData = async () => {
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
    if(id) fetchData();
  }, [id, user]);

  // NEW: Toggle Checkbox
  const handleToggleTask = async (itemId) => {
    try {
        const { data } = await api.patch(`/projects/${id}/checklist`, { itemId });
        setProject(data); // Update local state with new checklist
    } catch (error) { toast.error("Failed to update task"); }
  };

  // ... (Existing handlers for Bids, Hire, Submit, Review - keeping them same)
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    try { await api.post(`/bids/${id}`, { bidAmount, daysToComplete: days, proposal }); toast.success("Bid placed!"); window.location.reload(); } 
    catch (error) { toast.error("Failed to place bid"); }
  };
  const handleHire = async (bidId) => {
    if(!window.confirm("Hire this contractor?")) return;
    try { await api.post('/contracts', { bidId }); toast.success("Hired!"); window.location.reload(); } 
    catch (error) { toast.error("Failed to hire."); }
  };
  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if(!window.confirm("Submit work?")) return;
    try { await api.post('/contracts/deliver', { projectId: id, workLink, notes }); toast.success("Work Submitted!"); window.location.reload(); } 
    catch (error) { toast.error("Failed to submit."); }
  };
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try { await api.post('/reviews', { projectId: id, rating, comment: reviewComment }); toast.success("Review submitted!"); window.location.reload(); } 
    catch (error) { toast.error("Failed to submit review"); }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!project) return null;

  const isOwner = user && project.createdBy._id === user._id;
  const isContractor = !isOwner && user.role === 'Contractor';
  const allTasksCompleted = project.checklist.every(t => t.isCompleted);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Link>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${
                project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>{project.status}</span>
            <p className="mt-4 text-gray-700">{project.description}</p>

            {/* NEW: Checklist Display */}
            {project.checklist && project.checklist.length > 0 && (
                <div className="mt-8 bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <ListTodo className="h-5 w-5" /> Project Deliverables
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
                </div>
            )}
          </div>
        </div>

        {/* 1. BIDDING */}
        {isContractor && project.status === 'OPEN' && (
          <div className="bg-white shadow rounded-lg px-6 py-8">
            <h3 className="text-xl font-bold mb-4">Place a Bid</h3>
            <form onSubmit={handlePlaceBid} className="space-y-4">
                <input type="number" placeholder="Amount ($)" className="w-full border p-2 rounded" value={bidAmount} onChange={e=>setBidAmount(e.target.value)} required />
                <input type="number" placeholder="Days" className="w-full border p-2 rounded" value={days} onChange={e=>setDays(e.target.value)} required />
                <textarea placeholder="Proposal" className="w-full border p-2 rounded" value={proposal} onChange={e=>setProposal(e.target.value)} required />
                <button className="w-full bg-primary text-white py-2 rounded">Submit Bid</button>
            </form>
          </div>
        )}

        {/* 2. SUBMIT WORK (Restricted by Checklist!) */}
        {isContractor && project.status === 'IN_PROGRESS' && (
           <div className="bg-white shadow rounded-lg px-6 py-8 border-l-4 border-blue-500">
             <h3 className="text-xl font-bold mb-4">Submit Work</h3>
             {/* CHECKLIST VALIDATION MSG */}
             {!allTasksCompleted && (
                 <div className="bg-yellow-50 text-yellow-800 p-3 rounded mb-4 text-sm">
                    ⚠️ You must complete all deliverables in the checklist above before submitting.
                 </div>
             )}
             <form onSubmit={handleSubmitWork} className="space-y-4">
               <input type="text" placeholder="GitHub Link" className="w-full border p-2 rounded" value={workLink} onChange={e=>setWorkLink(e.target.value)} required />
               <textarea placeholder="Notes" className="w-full border p-2 rounded" value={notes} onChange={e=>setNotes(e.target.value)} required />
               
               <button 
                  disabled={!allTasksCompleted}
                  className={`w-full py-2 rounded font-bold transition-colors ${
                      allTasksCompleted 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
               >
                  {allTasksCompleted ? "Submit for Payment" : "Complete Checklist First"}
               </button>
             </form>
           </div>
        )}

        {/* 3. REVIEWS & BIDS (Remaining UI) */}
        {project.status === 'COMPLETED' && (
            <div className="bg-white shadow rounded-lg px-6 py-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Star className="text-yellow-400" /> Reviews</h3>
                {reviews.map(r => (
                    <div key={r._id} className="border p-4 rounded bg-gray-50 mb-4">
                        <div className="font-bold">{r.reviewer.name} <span className="text-yellow-500">{'★'.repeat(r.rating)}</span></div>
                        <p>"{r.comment}"</p>
                    </div>
                ))}
                {!reviews.some(r => r.reviewer._id === user._id) && (
                    <form onSubmit={handleSubmitReview} className="mt-6 border-t pt-4 space-y-4">
                        <select value={rating} onChange={e=>setRating(Number(e.target.value))} className="border p-2 rounded w-full">
                            <option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option><option value="1">1 Star</option>
                        </select>
                        <textarea placeholder="Review..." className="w-full border p-2 rounded" value={reviewComment} onChange={e=>setReviewComment(e.target.value)} required />
                        <button className="bg-primary text-white px-6 py-2 rounded">Post Review</button>
                    </form>
                )}
            </div>
        )}

        {isOwner && project.status === 'OPEN' && (
          <div className="bg-white shadow rounded-lg px-6 py-8 mt-8">
            <h3 className="text-xl font-bold mb-4">Received Bids</h3>
            {bids.map(bid => (
              <div key={bid._id} className="border p-4 rounded mb-4 flex justify-between">
                 <div><h4 className="font-bold">{bid.contractor.name}</h4><p>{bid.proposal}</p></div>
                 <button onClick={() => handleHire(bid._id)} className="bg-green-600 text-white px-4 py-2 rounded self-start">Hire</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
