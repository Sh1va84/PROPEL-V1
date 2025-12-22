import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, User, Briefcase, Users, CheckCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Agent' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div 
                onClick={() => setFormData({ ...formData, role: 'Agent' })}
                className={`cursor-pointer p-4 border-2 rounded-xl flex flex-col items-center justify-center transition-all ${formData.role === 'Agent' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}
              >
                <Briefcase className={`h-8 w-8 mb-2 ${formData.role === 'Agent' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className={`font-bold text-sm ${formData.role === 'Agent' ? 'text-indigo-900' : 'text-gray-500'}`}>Manager</span>
              </div>
              <div 
                onClick={() => setFormData({ ...formData, role: 'Contractor' })}
                className={`cursor-pointer p-4 border-2 rounded-xl flex flex-col items-center justify-center transition-all ${formData.role === 'Contractor' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}
              >
                <Users className={`h-8 w-8 mb-2 ${formData.role === 'Contractor' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className={`font-bold text-sm ${formData.role === 'Contractor' ? 'text-indigo-900' : 'text-gray-500'}`}>Contractor</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Team working"
        />
        <div className="absolute inset-0 bg-indigo-900 bg-opacity-40 mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 p-20 text-white">
            <h2 className="text-4xl font-bold mb-4">Join the Network.</h2>
            <ul className="space-y-4 text-lg text-indigo-100">
                <li className="flex items-center"><CheckCircle className="h-6 w-6 mr-2 text-green-400"/> Instant Job Access</li>
                <li className="flex items-center"><CheckCircle className="h-6 w-6 mr-2 text-green-400"/> Guaranteed Payments</li>
                <li className="flex items-center"><CheckCircle className="h-6 w-6 mr-2 text-green-400"/> Professional Tools</li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;
