import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, DollarSign, Calendar, Layers, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    requiredSkills: ''
  });

  // Auto-resize function
  const handleDescriptionChange = (e) => {
    setFormData({ ...formData, description: e.target.value });
    
    // Reset height to auto to calculate the correct scrollHeight (shrink if needed)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skillsArray = formData.requiredSkills.split(',').map(s => s.trim());
      
      await api.post('/projects', {
        ...formData,
        requiredSkills: skillsArray,
        visibility: 'Public'
      });

      toast.success('Work Order Created Successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </button>

        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="bg-indigo-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Layers className="h-6 w-6" />
              Create New Work Order
            </h1>
            <p className="text-indigo-100 mt-2">
              Define the scope, budget, and timeline for your new project.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
              <input
                type="text"
                required
                className="block w-full rounded-lg border-gray-300 border p-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                placeholder="e.g. Build a Blockchain Wallet"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  ref={textareaRef}
                  required
                  rows={6}
                  className="block w-full rounded-lg border-gray-300 border p-3 pl-10 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all overflow-hidden"
                  placeholder="Describe the deliverables, requirements, and any specific constraints..."
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  style={{ minHeight: '150px' }} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget (USD)</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    required
                    className="block w-full rounded-lg border-gray-300 border p-3 pl-10 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    required
                    className="block w-full rounded-lg border-gray-300 border p-3 pl-10 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (Comma separated)</label>
              <input
                type="text"
                className="block w-full rounded-lg border-gray-300 border p-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                placeholder="React, Node.js, MongoDB"
                value={formData.requiredSkills}
                onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
              >
                {loading ? 'Publishing...' : 'Publish Work Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
