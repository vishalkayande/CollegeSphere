import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import OrganizerDashboard from './OrganizerDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'student') return <StudentDashboard />;
  if (user?.role === 'organizer') return <OrganizerDashboard />;
  if (user?.role === 'admin') return <AdminDashboard />;

  return <div>Loading dashboard...</div>;
};

export default Dashboard;
