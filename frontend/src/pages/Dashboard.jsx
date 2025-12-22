import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import AgentDashboard from '../components/AgentDashboard';
import ContractorDashboard from '../components/ContractorDashboard';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);

  // 1. Wait for auth to check local storage
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  // 2. SAFETY CHECK: If logged out, redirect immediately
  // This prevents the "Crash" because we never try to render the dashboards below
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Render the correct dashboard based on role
  return user.role === 'Agent' 
    ? <AgentDashboard user={user} /> 
    : <ContractorDashboard user={user} />;
};

export default Dashboard;
