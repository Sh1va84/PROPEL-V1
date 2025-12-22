import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { Plus, X, ListTodo } from 'lucide-react';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', budget: '', deadline: '', requiredSkills: '', visibility: 'public'
  });
  
  // Checklist State
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState('');

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
        checklist: tasks // Send the list to backend
      });
      toast.success('Work Order Created Successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Create New Work Order</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Title</label>
            <input name="title" type="text" required className="mt-1 block w-full border p-3 rounded-md" 
              placeholder="e.g. Build E-commerce Site" onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            {/* FIX APPLIED HERE: Auto-growing textarea */}
            <textarea 
                name="description" 
                rows="3" 
                required 
                className="mt-1 block w-full border p-3 rounded-md resize-none overflow-hidden min-h-[100px]" 
                placeholder="Detailed requirements..." 
                onChange={(e) => {
                    handleChange(e);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                }} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Budget ($)</label>
              <input name="budget" type="number" required className="mt-1 block w-full border p-3 rounded-md" 
                placeholder="5000" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input name="deadline" type="date" required className="mt-1 block w-full border p-3 rounded-md" 
                onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Required Skills (comma separated)</label>
            <input name="requiredSkills" type="text" required className="mt-1 block w-full border p-3 rounded-md" 
              placeholder="React, Node.js, MongoDB" onChange={handleChange} />
          </div>

          {/* Checklist Builder */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <ListTodo className="h-4 w-4" /> Define Deliverables (Checklist)
            </label>
            <div className="flex gap-2 mb-2">
                <input 
                    type="text" 
                    className="flex-1 border p-2 rounded" 
                    placeholder="e.g. Setup Database"
                    value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTask())}
                />
                <button type="button" onClick={addTask} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black">
                    Add
                </button>
            </div>
            <ul className="space-y-2">
                {tasks.map((task, index) => (
                    <li key={index} className="flex justify-between items-center bg-white p-2 rounded border shadow-sm">
                        <span className="text-sm text-gray-700">{index + 1}. {task.text}</span>
                        <button type="button" onClick={() => removeTask(index)} className="text-red-500 hover:text-red-700">
                            <X className="h-4 w-4" />
                        </button>
                    </li>
                ))}
                {tasks.length === 0 && <p className="text-xs text-gray-400 italic">No tasks added yet.</p>}
            </ul>
          </div>

          <button type="submit" className="w-full flex justify-center py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-800">
            Publish Work Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
