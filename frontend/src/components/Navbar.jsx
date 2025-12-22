import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Briefcase, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Propel</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-500 hidden md:block">
                  Hello, <span className="font-semibold text-gray-900">{user.name}</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 border border-gray-200">
                    {user.role}
                  </span>
                </span>
                
                <Link to="/dashboard" className="text-gray-600 hover:text-primary font-medium text-sm transition-colors">
                  Dashboard
                </Link>

                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                  Log In
                </Link>
                <Link to="/register" className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
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
