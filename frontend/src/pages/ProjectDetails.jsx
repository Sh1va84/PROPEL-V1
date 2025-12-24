import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  Building, Calendar, DollarSign, Clock, CheckCircle, AlertTriangle, 
  Send, Upload, FileText, User, Wrench, Package, Download 
} from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quoteForm, setQuoteForm] = useState({
    bidAmount: '',
    daysToComplete: '',
    proposal: ''
  });

  const [deliveryForm, setDeliveryForm] = useState({
    workLink: '',
    notes: ''
  });

  useEffect(() => {
    fetchProjectDetails();
  }, [id, user]);

  const fetchProjectDetails = async () => {
    try {
      // Fetch project
      const projectRes = await api.get(`/projects/${id}`);
      setProject(projectRes.data);

      // Fetch bids
      const bidsRes = await api.get(`/bids/${id}`);
      setBids(bidsRes.data);

      // Fetch contract - try MULTIPLE approaches
      let foundContract = null;
      
      // Approach 1: Try my-contracts endpoint
      try {
        const contractsRes = await api.get('/contracts/my-contracts');
        foundContract = contractsRes.data.find(c => c.project?._id === id || c.project === id);
      } catch (err) {
        console.log('my-contracts failed');
      }

      // Approach 2: If agent and no contract found, check ALL accepted bids
      if (!foundContract && user?.role === 'Agent') {
        const acceptedBid = bidsRes.data.find(b => b.status === 'ACCEPTED');
        if (acceptedBid) {
          // There's an accepted bid, so contract must exist
          // Let's try to fetch it differently or create a placeholder
          console.log('Found accepted bid, contract should exist');
          
          // Try fetching contracts again but check project property vs _id
          try {
            const allContracts = await api.get('/contracts/my-contracts');
            console.log('All contracts:', allContracts.data);
            
            // More flexible search
            foundContract = allContracts.data.find(c => {
              const projectId = c.project?._id || c.project;
              return projectId?.toString() === id.toString();
            });
          } catch (err2) {
            console.log('Second attempt failed');
          }
        }
      }

      setContract(foundContract);
      console.log('✅ Final contract:', foundContract);
      
    } catch (error) {
      toast.error('Failed to load details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/bids/${id}`, quoteForm);
      toast.success('Quote submitted!');
      setQuoteForm({ bidAmount: '', daysToComplete: '', proposal: '' });
      fetchProjectDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  const handleAcceptQuote = async (bidId) => {
    if (!window.confirm('Award this contract?')) return;
    try {
      await api.post('/contracts', { bidId });
      toast.success('Contract awarded!');
      setTimeout(() => fetchProjectDetails(), 1500);
    } catch (error) {
      toast.error('Failed to award contract');
    }
  };

  const handleDeliverWork = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contracts/deliver', {
        projectId: id,
        workLink: deliveryForm.workLink,
        notes: deliveryForm.notes
      });
      toast.success('Work submitted!');
      setDeliveryForm({ workLink: '', notes: '' });
      setTimeout(() => fetchProjectDetails(), 1500);
    } catch (error) {
      toast.error('Failed to submit work');
    }
  };

  const handleReleasePayment = async () => {
    if (!window.confirm('Release payment? Invoice will be generated.')) return;
    try {
      // Try with contract ID first, then project ID
      const contractId = contract._id || id;
      await api.put(`/contracts/${contractId}/pay`);
      toast.success('Payment released! Invoice sent.');
      setTimeout(() => fetchProjectDetails(), 1500);
    } catch (error) {
      toast.error('Failed to release payment');
    }
  };

  const toggleChecklist = async (itemId) => {
    try {
      await api.patch(`/projects/${id}/checklist`, { itemId });
      fetchProjectDetails();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!project) return <div className="text-center py-12">Not found</div>;

  const isPropertyManager = user?.role === 'Agent' && project.createdBy?._id === user._id;
  const isContractor = user?.role === 'Contractor';
  const isMyContract = contract && (
    contract.contractor?._id === user?._id || 
    contract.contractor === user?._id
  );

  // IMPORTANT: Check if there's an accepted bid (means contract exists even if not loaded)
  const hasAcceptedBid = bids.some(b => b.status === 'ACCEPTED');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-8 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
            project.status === 'OPEN' ? 'bg-green-100 text-green-800' :
            project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
            project.status === 'WORK_SUBMITTED' ? 'bg-purple-100 text-purple-800' :
            project.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {project.status.replace('_', ' ')}
          </span>
          <span className="text-xs text-gray-400">
            Posted {new Date(project.createdAt).toLocaleDateString('en-GB')}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        <p className="text-gray-600">{project.description}</p>

        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Budget</p>
              <p className="font-bold">£{project.budget}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Deadline</p>
              <p className="font-bold">{new Date(project.deadline).toLocaleDateString('en-GB')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Wrench className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Trade</p>
              <p className="font-bold text-sm">{project.requiredSkills?.join(', ')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Quotes</p>
              <p className="font-bold">{bids.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          {/* Checklist */}
          {project.checklist?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                Deliverables
              </h3>
              <ul className="space-y-3">
                {project.checklist.map((item) => (
                  <li key={item._id} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={() => toggleChecklist(item._id)}
                      disabled={!isPropertyManager && !isMyContract}
                      className="h-5 w-5 text-purple-600 rounded cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className={item.isCompleted ? 'line-through text-gray-400' : ''}>{item.text}</span>
                    {item.isCompleted && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Quote */}
          {isContractor && !hasAcceptedBid && project.status === 'OPEN' && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Send className="h-5 w-5 text-purple-600" />
                Submit Quote
              </h3>
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (£)</label>
                    <input
                      type="number"
                      required
                      className="w-full border p-3 rounded-lg"
                      placeholder="450"
                      value={quoteForm.bidAmount}
                      onChange={(e) => setQuoteForm({ ...quoteForm, bidAmount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Days</label>
                    <input
                      type="number"
                      required
                      className="w-full border p-3 rounded-lg"
                      placeholder="5"
                      value={quoteForm.daysToComplete}
                      onChange={(e) => setQuoteForm({ ...quoteForm, daysToComplete: e.target.value })}
                    />
                  </div>
                </div>
                <textarea
                  required
                  rows="4"
                  className="w-full border p-3 rounded-lg resize-none"
                  placeholder="Your proposal..."
                  value={quoteForm.proposal}
                  onChange={(e) => setQuoteForm({ ...quoteForm, proposal: e.target.value })}
                />
                <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700">
                  Submit Quote
                </button>
              </form>
            </div>
          )}

          {/* Submit Work - Show if contractor AND (has contract OR project is IN_PROGRESS) */}
          {isContractor && (contract?.status === 'ACTIVE' || project.status === 'IN_PROGRESS') && project.status !== 'WORK_SUBMITTED' && project.status !== 'COMPLETED' && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border-2 border-green-400 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-600 p-3 rounded-lg">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Submit Completed Work</h3>
                  <p className="text-sm text-gray-600">Upload deliverables for review</p>
                </div>
              </div>
              
              <form onSubmit={handleDeliverWork} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Work Link</label>
                  <input
                    type="url"
                    required
                    className="w-full border-2 p-3 rounded-lg"
                    placeholder="https://drive.google.com/file/..."
                    value={deliveryForm.workLink}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, workLink: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Notes</label>
                  <textarea
                    required
                    rows="4"
                    className="w-full border-2 p-3 rounded-lg resize-none"
                    placeholder="Summary of work completed..."
                    value={deliveryForm.notes}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, notes: e.target.value })}
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 shadow-lg flex items-center justify-center gap-2"
                >
                  <Package className="h-5 w-5" />
                  Submit for Review
                </button>
              </form>
            </div>
          )}

          {/* Work Submitted (Contractor View) */}
          {isContractor && project.status === 'WORK_SUBMITTED' && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-300 p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="text-xl font-bold">Work Submitted ✅</h3>
                  <p className="text-sm text-gray-600">Waiting for approval</p>
                </div>
              </div>
              {project.workSubmissionLink && (
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-sm font-bold mb-2">Your Submission:</p>
                  <a href={project.workSubmissionLink} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline break-all">
                    {project.workSubmissionLink}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Review & Pay (Agent View) - Show if project is WORK_SUBMITTED */}
          {isPropertyManager && project.status === 'WORK_SUBMITTED' && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg border-2 border-yellow-400 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-600 p-3 rounded-lg animate-pulse">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">⚠️ Review Work</h3>
                  <p className="text-sm">Contractor completed the work</p>
                </div>
              </div>
              
              {project.workSubmissionLink && (
                <div className="bg-white p-5 rounded-lg mb-4 border-2">
                  <p className="text-sm font-bold mb-2 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Submission:
                  </p>
                  <a 
                    href={project.workSubmissionLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-purple-600 hover:underline break-all block font-medium underline"
                  >
                    {project.workSubmissionLink}
                  </a>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4 text-sm">
                📄 Invoice will be auto-generated upon approval
              </div>
              
              <button
                onClick={handleReleasePayment}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-6 w-6" />
                Approve & Release £{project.budget} Payment
              </button>
            </div>
          )}

          {/* Completed */}
          {project.status === 'COMPLETED' && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-400 p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-xl font-bold">✅ Completed</h3>
                  <p className="text-sm">Payment released</p>
                </div>
              </div>
              {project.workSubmissionLink && (
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-sm font-bold mb-2">Final Delivery:</p>
                  <a href={project.workSubmissionLink} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline break-all">
                    {project.workSubmissionLink}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Quotes */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold mb-4">Quotes ({bids.length})</h3>
            {bids.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No quotes yet</p>
            ) : (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div key={bid._id} className="border rounded-lg p-4">
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-bold">{bid.contractor?.name}</p>
                          <p className="text-xs text-gray-500">{bid.contractor?.email}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full h-fit ${
                        bid.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {bid.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3 pb-3 border-b">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-bold text-lg">£{bid.bidAmount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{bid.daysToComplete} days</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{bid.proposal}</p>
                    
                    {isPropertyManager && bid.status === 'PENDING' && !hasAcceptedBid && (
                      <button
                        onClick={() => handleAcceptQuote(bid._id)}
                        className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700"
                      >
                        Award Contract
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Property Manager</h3>
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="font-bold">{project.createdBy?.name}</p>
                <p className="text-xs text-gray-500">{project.createdBy?.email}</p>
              </div>
            </div>
          </div>

          {(contract || hasAcceptedBid) && (
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-bold uppercase mb-4 opacity-90">Contract</h3>
              <div className="space-y-3">
                <div className="flex justify-between pb-3 border-b border-white/20">
                  <span className="text-sm opacity-90">Value</span>
                  <span className="text-2xl font-bold">£{contract?.terms?.amount || project.budget}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-white/20">
                  <span className="text-sm opacity-90">Timeline</span>
                  <span className="font-bold">{contract?.terms?.days || 'TBD'} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm opacity-90">Status</span>
                  <span className="font-bold text-sm">{(contract?.status || project.status).replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
