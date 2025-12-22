import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, DollarSign, Calendar, Briefcase, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const ContractorDashboard = ({ user }) => {
  if (!user) return null;

  const [jobs, setJobs] = useState([]);
  const [myContracts, setMyContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await api.get('/projects');
        setJobs(jobsRes.data.filter(job => job.status === 'OPEN'));

        const contractsRes = await api.get('/contracts/my-contracts');
        // Filter out any contracts where the project was deleted (project is null)
        const validContracts = contractsRes.data.filter(c => c.project !== null);
        setMyContracts(validContracts);
      } catch (error) {
        console.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* SECTION 1: MY ACTIVE JOBS (Hired) */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle className="text-green-600" /> My Active Jobs
        </h2>
        
        {myContracts.length === 0 ? (
           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">You haven't been hired for any jobs yet.</p>
           </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myContracts.map(contract => (
              <div key={contract._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      contract.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      contract.status === 'WORK_SUBMITTED' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {contract.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(contract.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* SAFE CHECK: Only render if project exists */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                    {contract.project?.title || "Unknown Project"}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                       <DollarSign className="w-4 h-4 mr-2 text-gray-400" /> 
                       ${contract.terms.amount}
                    </div>
                    <div className="flex items-center">
                       <Clock className="w-4 h-4 mr-2 text-gray-400" /> 
                       {contract.terms.days} Days Timeline
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-50">
                     <Link to={`/projects/${contract.project?._id}`} className="block w-full text-center bg-gray-900 text-white py-2 rounded hover:bg-black transition-colors">
                        Open Workroom
                     </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: MARKETPLACE (Open Jobs) */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Briefcase className="text-blue-600" /> New Opportunities
        </h2>
        
        {jobs.length === 0 ? (
           <p className="text-gray-500">No open jobs available right now.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map(job => (
              <div key={job._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{job.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>Budget: ${job.budget}</span>
                    <span>Due: {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
                <Link to={`/projects/${job._id}`} className="block w-full text-center border border-primary text-primary py-2 rounded hover:bg-blue-50 transition-colors">
                    View & Bid
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ContractorDashboard;
