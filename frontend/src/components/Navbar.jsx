import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, ShieldCheck, Trophy } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="CollegeSphere Logo" className="h-14 w-auto drop-shadow-sm" />
          <span className="text-2xl font-black tracking-tighter">
            <span className="text-[#003B5C]">College</span><span className="text-[#00B5AD]">Sphere</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-12">
          {user?.role !== 'admin' && (
            <>
              <Link to="/" className="text-[#003B5C] hover:text-blue-600 text-lg font-black transition">Events</Link>
              <Link to="/leaderboard" className="text-[#003B5C] hover:text-blue-600 text-lg font-black transition flex items-center gap-2">
                <Trophy className="w-6 h-6" /> Leaderboard
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 px-5 py-2.5 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
            <User className="w-6 h-6 text-[#003B5C]" />
            <span className="text-lg font-black text-[#003B5C]">{user?.name}</span>
            <span className="text-[11px] uppercase bg-blue-100 text-blue-600 px-2.5 py-1 rounded-md font-black">
              {user?.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
