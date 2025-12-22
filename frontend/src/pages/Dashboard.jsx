import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import AgentDashboard from '../components/AgentDashboard';
import ContractorDashboard from '../components/ContractorDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="p-10 text-center">Loading user data...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === 'Agent' ? (
        <AgentDashboard user={user} />
      ) : (
        <ContractorDashboard user={user} />
      )}
    </div>
  );
};

export default Dashboard;
