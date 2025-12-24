import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, DollarSign, Calendar, Briefcase, CheckCircle, Clock, AlertTriangle, Wrench } from 'lucide-react';

const ContractorDashboard = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [myContracts, setMyContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const jobsRes = await api.get('/projects');
        setJobs(jobsRes.data.filter(job => job.status === 'OPEN'));

        const contractsRes = await api.get('/contracts/my-contracts');
        const validContracts = contractsRes.data.filter(c => c.project !== null);
        setMyContracts(validContracts);
      } catch (error) {
        console.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
        fetchData();
    } else {
        setLoading(false);
    }
  }, [user]);

  if (!user) return null;
  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* SECTION 1: MY ACTIVE CONTRACTS */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle className="text-green-600" /> My Active Contracts
        </h2>
        
        {myContracts.length === 0 ? (
           <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <Wrench className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium">You haven't been awarded any maintenance contracts yet.</p>
              <p className="text-sm text-gray-400 mt-2">Submit quotes on available requests below to get started!</p>
           </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myContracts.map(contract => (
              <div key={contract._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
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
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                    {contract.project?.title || "Maintenance Request"}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                       <DollarSign className="w-4 h-4 mr-2 text-gray-400" /> 
                       £{contract.terms.amount}
                    </div>
                    <div className="flex items-center">
                       <Clock className="w-4 h-4 mr-2 text-gray-400" /> 
                       {contract.terms.days} Days Timeline
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                     <Link 
                       to={`/projects/${contract.project?._id}`} 
                       className="block w-full text-center bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                     >
                        Open Workroom
                     </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: AVAILABLE MAINTENANCE REQUESTS */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Briefcase className="text-blue-600" /> Available Maintenance Requests
        </h2>
        
        {jobs.length === 0 ? (
           <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">No open maintenance requests available right now.</p>
              <p className="text-sm text-gray-400 mt-2">Check back soon for new opportunities!</p>
           </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map(job => (
              <div key={job._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all hover:border-purple-300 p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">OPEN</span>
                  <span className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{job.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">£{job.budget}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                </div>
                
                <Link 
                  to={`/projects/${job._id}`} 
                  className="block w-full text-center border-2 border-purple-600 text-purple-600 py-2.5 rounded-lg hover:bg-purple-50 transition-colors font-bold"
                >
                    View & Submit Quote
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
