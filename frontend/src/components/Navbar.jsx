import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { Menu, X, LayoutDashboard, LogOut, Building, User, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle Scroll Effect (Glassmorphism)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  // Check if we are on the landing page
  const isLanding = location.pathname === '/';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled || !isLanding ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-slate-900 text-white p-2 rounded-xl group-hover:bg-[#9F7A49] transition-colors duration-300 shadow-md">
              <Building className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight group-hover:opacity-80 transition-opacity">
              Propel
            </span>
          </Link>

          {/* --- DESKTOP MENU --- */}
          <div className="hidden md:flex items-center space-x-8">
            {!user ? (
                <>
                  <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Landlords</Link>
                  <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Agents</Link>
                  <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Tradespeople</Link>
                  
                  <div className="h-6 w-px bg-gray-200"></div>

                  <Link to="/login" className="text-sm font-bold text-slate-900 hover:text-[#9F7A49] transition-colors">
                    Log in
                  </Link>
                  <Link to="/register" className="bg-[#9F7A49] hover:bg-[#8a6a3e] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-orange-900/10 transition-all hover:-translate-y-0.5 flex items-center gap-1">
                    Get Started <ChevronRight className="w-4 h-4" />
                  </Link>
                </>
            ) : (
                <>
                  <Link to="/dashboard" className="text-slate-600 hover:text-[#9F7A49] font-medium flex items-center gap-2 transition-colors">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  
                  <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                      <div className="text-right hidden lg:block">
                          <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500 capitalize">{user.role === 'Client' ? 'Property Manager' : 'Contractor'}</p>
                      </div>
                      <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200">
                          <User className="h-5 w-5" />
                      </div>
                      <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-all" title="Logout">
                          <LogOut className="h-5 w-5" />
                      </button>
                  </div>
                </>
            )}
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 p-2 hover:bg-slate-100 rounded-lg transition-colors">
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 top-20 shadow-xl animate-in slide-in-from-top-5 z-40">
          <div className="px-6 py-8 space-y-6">
            {!user ? (
              <>
                <div className="space-y-4">
                    <Link to="/" className="block text-lg font-medium text-slate-600" onClick={()=>setIsOpen(false)}>Landlords</Link>
                    <Link to="/" className="block text-lg font-medium text-slate-600" onClick={()=>setIsOpen(false)}>Agents</Link>
                    <Link to="/" className="block text-lg font-medium text-slate-600" onClick={()=>setIsOpen(false)}>Tradespeople</Link>
                </div>
                <div className="pt-6 border-t border-gray-100 space-y-4">
                    <Link to="/login" className="block text-center text-lg font-bold text-slate-900 w-full py-3 border border-slate-200 rounded-xl hover:bg-slate-50" onClick={()=>setIsOpen(false)}>Log in</Link>
                    <Link to="/register" className="block w-full text-center bg-[#9F7A49] text-white px-5 py-3 rounded-xl font-bold shadow-md active:scale-95 transition-transform" onClick={()=>setIsOpen(false)}>
                    Get Started Free
                    </Link>
                </div>
              </>
            ) : (
              <>
                 <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                    <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-[#9F7A49] shadow-sm font-bold text-xl border border-slate-200">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 text-lg">{user.name}</p>
                        <p className="text-sm text-slate-500 capitalize">{user.role}</p>
                    </div>
                 </div>
                 <Link to="/dashboard" className="flex items-center gap-3 text-lg font-medium text-slate-900 p-3 hover:bg-slate-50 rounded-lg" onClick={()=>setIsOpen(false)}>
                    <LayoutDashboard className="h-6 w-6 text-[#9F7A49]" /> Dashboard
                 </Link>
                 <button onClick={handleLogout} className="flex items-center gap-3 text-lg font-medium text-red-600 w-full text-left p-3 hover:bg-red-50 rounded-lg">
                    <LogOut className="h-6 w-6" /> Logout
                 </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
