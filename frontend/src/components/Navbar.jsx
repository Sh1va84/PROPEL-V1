import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Briefcase, LogOut, User, LayoutDashboard } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Propel</span>
            </Link>
          </div>

          {/* Right Side Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-500 hidden sm:inline">
                  Hello, <span className="font-bold text-gray-900">{user.name}</span>
                </span>
                
                {/* Role Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    user.role === 'Agent' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>

                <Link 
                  to="/dashboard" 
                  className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
                >
                   <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors ml-4"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium">Log in</Link>
                <Link
                  to="/register"
                  className="ml-4 px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-800 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
