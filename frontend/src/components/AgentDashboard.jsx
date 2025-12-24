import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Clock, CheckCircle, AlertCircle, FileText, Trash2, Eye, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AgentDashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProjects = async () => {
      if (!user) return; 

      try {
        const { data } = await api.get('/projects'); 
        const myProjects = data.filter(p => 
          (p.createdBy === user._id) || (p.createdBy?._id === user._id)
        ); 
        setProjects(myProjects);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
        fetchMyProjects();
    } else {
        setLoading(false);
    }
  }, [user]); 

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this maintenance request?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success("Maintenance request deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (!user) return null; 

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="text-purple-600" />
            Property Operations Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back, Property Manager {user.name}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/create-project"
            className="inline-flex items-center px-5 py-3 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            New Maintenance Request
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Requests Posted</dt>
                <dd className="text-2xl font-bold text-gray-900">{projects.length}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
                <dd className="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === 'OPEN' || p.status === 'IN_PROGRESS').length}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                <dd className="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === 'COMPLETED').length}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Maintenance Requests Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg leading-6 font-bold text-gray-900">Recent Maintenance Requests</h3>
          <p className="mt-1 text-sm text-gray-500">Manage all your property maintenance work orders</p>
        </div>
        <ul className="divide-y divide-gray-200">
          {loading ? (
            <li className="p-8 text-center text-gray-500">
              <div className="animate-pulse">Loading your maintenance requests...</div>
            </li>
          ) : projects.length === 0 ? (
            <li className="p-12 text-center">
              <AlertCircle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No maintenance requests yet</h3>
              <p className="text-sm text-gray-500 mb-4">Get started by creating your first maintenance request for a property.</p>
              <Link 
                to="/create-project"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Request
              </Link>
            </li>
          ) : (
            projects.map((project) => (
              <li key={project._id} className="hover:bg-gray-50 transition-colors">
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                        <Link 
                          to={`/projects/${project._id}`} 
                          className="text-lg font-bold text-purple-600 hover:text-purple-800 hover:underline cursor-pointer block mb-1"
                        >
                            {project.title}
                        </Link>
                        <p className="text-xs text-gray-400 mb-2">Request ID: {project._id.substring(0, 12)}...</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 text-xs font-bold rounded-full whitespace-nowrap ${
                            project.status === 'OPEN' ? 'bg-green-100 text-green-800' : 
                            project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'WORK_SUBMITTED' ? 'bg-purple-100 text-purple-800' :
                            project.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {project.status.replace('_', ' ')}
                        </span>
                        
                        <Link 
                           to={`/projects/${project._id}`}
                           className="text-gray-400 hover:text-purple-600 p-2 rounded-full hover:bg-purple-50 transition-colors"
                           title="View Details"
                        >
                           <Eye className="h-5 w-5" />
                        </Link>
                        
                        <button 
                            onClick={() => handleDelete(project._id)}
                            className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete Request"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-6">
                      <span className="font-semibold text-gray-700">Budget: £{project.budget}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        Due {new Date(project.deadline).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      Posted {new Date(project.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default AgentDashboard;
