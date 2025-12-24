import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { Plus, X, ListTodo, Home, AlertTriangle } from 'lucide-react';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', 
    description: '', 
    budget: '', 
    deadline: '', 
    requiredSkills: '', 
    visibility: 'public',
    propertyAddress: '',
    maintenanceCategory: 'Plumbing',
    urgencyLevel: 'Routine'
  });
  
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState('');

  const maintenanceCategories = [
    'Plumbing', 'Electrical', 'HVAC', 'Carpentry', 
    'Painting', 'Roofing', 'Appliance Repair', 'General Maintenance'
  ];

  const urgencyLevels = [
    { value: 'Emergency', color: 'bg-red-100 text-red-800' },
    { value: 'Urgent', color: 'bg-orange-100 text-orange-800' },
    { value: 'Routine', color: 'bg-blue-100 text-blue-800' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    if (!currentTask.trim()) return;
    setTasks([...tasks, { text: currentTask, isCompleted: false }]);
    setCurrentTask('');
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()),
        checklist: tasks
      });
      toast.success('Maintenance Request Created Successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create maintenance request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-600 p-3 rounded-lg">
            <Home className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create Maintenance Request</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Property Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Address</label>
            <input 
              name="propertyAddress" 
              type="text" 
              required 
              className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
              placeholder="e.g. Flat 4B, Building A, 123 High Street, London"
              value={formData.propertyAddress}
              onChange={handleChange}
            />
          </div>

          {/* Maintenance Category & Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Type</label>
              <select 
                name="maintenanceCategory"
                className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={formData.maintenanceCategory}
                onChange={handleChange}
              >
                {maintenanceCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Urgency Level
              </label>
              <select 
                name="urgencyLevel"
                className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={formData.urgencyLevel}
                onChange={handleChange}
              >
                {urgencyLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.value}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Work Order Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Work Order Title</label>
            <input 
              name="title" 
              type="text" 
              required 
              className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
              placeholder="e.g. Emergency Boiler Repair - No Hot Water"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
            <textarea 
              name="description" 
              rows="4" 
              required 
              className="mt-1 block w-full border border-gray-300 p-3 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
              placeholder="Describe the issue in detail. Include any relevant information about the problem, when it started, and any safety concerns."
              value={formData.description}
              onChange={(e) => {
                handleChange(e);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
          </div>

          {/* Budget & Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Budget (£)</label>
              <input 
                name="budget" 
                type="number" 
                required 
                className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                placeholder="500"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Completion Date</label>
              <input 
                name="deadline" 
                type="date" 
                required 
                className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Trade Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trade/Qualification Required</label>
            <input 
              name="requiredSkills" 
              type="text" 
              required 
              className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
              placeholder="e.g. Gas Safe Engineer, Licensed Plumber, Qualified Electrician"
              value={formData.requiredSkills}
              onChange={handleChange}
            />
          </div>

          {/* Deliverables Checklist */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-purple-600" /> Define Deliverables (Work Checklist)
            </label>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                placeholder="e.g. Inspect boiler system, Replace faulty valve"
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTask())}
              />
              <button 
                type="button" 
                onClick={addTask} 
                className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 font-medium transition-colors"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {tasks.map((task, index) => (
                <li key={index} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <span className="text-sm text-gray-700 font-medium">{index + 1}. {task.text}</span>
                  <button 
                    type="button" 
                    onClick={() => removeTask(index)} 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
              {tasks.length === 0 && (
                <p className="text-xs text-gray-400 italic text-center py-4">
                  No deliverables added yet. Add specific tasks that need to be completed.
                </p>
              )}
            </ul>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 px-6 border border-transparent rounded-lg shadow-lg text-base font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all transform hover:-translate-y-0.5"
          >
            Publish Maintenance Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
