import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import AgentDashboard from '../components/AgentDashboard';
import ContractorDashboard from '../components/ContractorDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Route based on user role
  if (user.role === 'Agent') {
    return <AgentDashboard user={user} />;
  } else if (user.role === 'Contractor') {
    return <ContractorDashboard user={user} />;
  } else {
    return <div className="p-10 text-center">Unknown user role</div>;
  }
};

export default Dashboard;
