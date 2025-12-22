import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, DollarSign, Calendar, Briefcase, CheckCircle, Clock } from 'lucide-react';

const ContractorDashboard = ({ user }) => {
  // --- SAFETY SHIELD ---
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
        setMyContracts(contractsRes.data);
      } catch (error) {
        console.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* SECTION 1: MY ACTIVE JOBS */}
      {myContracts.length > 0 && (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CheckCircle className="text-green-600" /> My Active Jobs
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myContracts.map((contract) => (
                    <div key={contract._id} className="bg-white border-l-4 border-green-500 shadow rounded-lg p-6 relative">
                        <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                            HIRED
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 truncate mb-2">{contract.project.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">Client: {contract.client.name}</p>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-2xl font-bold text-primary">${contract.terms.amount}</span>
                            <span className="flex items-center text-sm text-gray-500">
                                <Clock className="w-4 h-4 mr-1" /> {contract.terms.days} Days
                            </span>
                        </div>
                        <Link 
                            to={`/projects/${contract.project._id}`}
                            className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Submit Work
                        </Link>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* SECTION 2: MARKETPLACE */}
      <div className="mb-8 border-t pt-8">
        <h1 className="text-3xl font-bold text-gray-900">Find New Work</h1>
        <p className="mt-1 text-sm text-gray-500">Browse available work orders and start bidding.</p>
      </div>

      <div className="mb-8">
        <div className="mt-1 relative rounded-md shadow-sm max-w-lg">
          <input
            type="text"
            className="focus:ring-primary focus:border-primary block w-full pl-4 sm:text-sm border-gray-300 rounded-lg p-3 border"
            placeholder="Search for skills, keywords..."
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading marketplace...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No new jobs available</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-blue-100 text-primary">
                    <Briefcase className="h-6 w-6" />
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">New</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 truncate">{job.title}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{job.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500"><DollarSign className="h-4 w-4 mr-1"/> ${job.budget}</div>
                  <div className="flex items-center text-gray-500"><Calendar className="h-4 w-4 mr-1"/> Due: {new Date(job.deadline).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <Link to={`/projects/${job._id}`} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-800 transition-colors">
                  View Details & Bid
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContractorDashboard;
