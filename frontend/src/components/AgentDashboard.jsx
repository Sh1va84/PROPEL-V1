import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Clock, CheckCircle, AlertCircle, FileText, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AgentDashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const { data } = await api.get('/projects'); 
        const myProjects = data.filter(p => 
          (p.createdBy === user._id) || (p.createdBy?._id === user._id)
        ); 
        setProjects(myProjects);
      } catch (error) {
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProjects();
  }, [user._id]);

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this Work Order?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success("Work Order deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back, Manager {user.name}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/create-project"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-800 transition-colors"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            New Work Order
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Work Orders</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {loading ? (
            <li className="p-4 text-center text-gray-500">Loading your data...</li>
          ) : projects.length === 0 ? (
            <li className="p-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No work orders</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new job.</p>
            </li>
          ) : (
            projects.map((project) => (
              <li key={project._id} className="hover:bg-gray-50 transition-colors">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    
                    {/* LEFT SIDE: Title */}
                    <div className="flex flex-col">
                        <Link 
                          to={`/projects/${project._id}`} 
                          className="text-lg font-bold text-primary hover:underline cursor-pointer block"
                        >
                            {project.title}
                        </Link>
                        <p className="text-xs text-gray-400">ID: {project._id.substring(0, 8)}...</p>
                    </div>

                    {/* RIGHT SIDE: Actions */}
                    <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            project.status === 'OPEN' ? 'bg-green-100 text-green-800' : 
                            project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {project.status}
                        </span>
                        
                        {/* VIEW BUTTON - The Backup Plan */}
                        <Link 
                           to={`/projects/${project._id}`}
                           className="text-gray-400 hover:text-primary p-2 rounded-full hover:bg-blue-50 transition-colors"
                           title="View Details"
                        >
                           <Eye className="h-5 w-5" />
                        </Link>

                        {/* DELETE BUTTON */}
                        <button 
                            onClick={() => handleDelete(project._id)}
                            className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete Project"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                  </div>
                  
                  {/* Bottom Row Info */}
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Budget: ${project.budget}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p>Due {new Date(project.deadline).toLocaleDateString()}</p>
                    </div>
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
