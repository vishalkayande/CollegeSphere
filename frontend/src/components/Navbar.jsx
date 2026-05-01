import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, ShieldCheck, Trophy, MoreVertical, Settings, Edit } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../apiConfig';

const Navbar = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const response = await axios.put(`${API_URL}/api/users/profile`, formData, config);
      updateUser(response.data);
      setShowProfileModal(false);
      setShowMenu(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update Profile Error:', err);
      setFormError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const openProfileModal = () => {
    if (user.role === 'student') {
      setFormData({
        branch: user.studentDetails?.branch || '',
        year: user.studentDetails?.year || '',
        class: user.studentDetails?.class || '',
        rollNo: user.studentDetails?.rollNo || '',
        mobileNo: user.studentDetails?.mobileNo || '',
      });
    } else if (user.role === 'organizer') {
      setFormData({
        department: user.organizerDetails?.department || '',
        mobileNo: user.organizerDetails?.mobileNo || '',
        contactEmail: user.organizerDetails?.contactEmail || '',
      });
    }
    setShowMenu(false);
    setShowProfileModal(true);
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" state={{ reset: true }} className="flex items-center gap-3">
            <img src="/logo.png" alt="CollegeSphere Logo" className="h-14 w-auto drop-shadow-sm" />
            <span className="text-2xl font-black tracking-tighter">
              <span className="text-[#003B5C]">College</span><span className="text-[#00B5AD]">Sphere</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-12">
            {(user?.role === 'student' || !user) && (
              <>
                <Link to="/" className="text-[#003B5C] hover:text-blue-600 text-lg font-black transition">Events</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 px-5 py-2.5 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
              <User className="w-6 h-6 text-[#003B5C]" />
              <span className="text-lg font-black text-[#003B5C]">{user?.name}</span>
              <span className="text-[11px] uppercase bg-blue-100 text-blue-600 px-2.5 py-1 rounded-md font-black">
                {user?.role}
              </span>
            </div>
            
            {/* Triple Dot Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowMenu(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <button
                      onClick={openProfileModal}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition"
                    >
                      <Edit className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-700">Update Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Update Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Update Profile</h2>
                <p className="text-sm text-gray-500 font-medium">{user?.name}</p>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)} 
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <MoreVertical className="w-6 h-6 rotate-45" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs font-bold border border-red-100">
                {formError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleUpdateProfile}>
              {user?.role === 'student' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Branch (Dept)</label>
                      <select 
                        name="branch" 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      >
                        <option value="">Select Dept</option>
                        <option value="CSE">CSE</option>
                        <option value="AIML">AIML</option>
                        <option value="MECH">MECH</option>
                        <option value="CIVIL">CIVIL</option>
                        <option value="E&TC">E&TC</option>
                        <option value="MBA">MBA</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Year</label>
                      <input 
                        name="year" 
                        placeholder="e.g. 3rd" 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Class & Roll No</label>
                    <div className="grid grid-cols-2 gap-4">
                      <select 
                        name="class" 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={formData.class}
                        onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      >
                        <option value="">Select Class</option>
                        <option value="FY A">FY A</option>
                        <option value="FY B">FY B</option>
                        <option value="SY A">SY A</option>
                        <option value="SY B">SY B</option>
                        <option value="TY A">TY A</option>
                        <option value="TY B">TY B</option>
                        <option value="B.TECH A">B.TECH A</option>
                        <option value="B.TECH B">B.TECH B</option>
                        <option value="MBA Ist">MBA Ist</option>
                        <option value="MBA 2nd">MBA 2nd</option>
                      </select>
                      <input 
                        name="rollNo" 
                        placeholder="Roll No (e.g., CS3135)" 
                        pattern="^[A-Z]{2}\d{4}$"
                        title="Roll number must be 2 alphabets followed by 4 digits (e.g., CS3135)"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={formData.rollNo}
                        onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Mobile Number</label>
                    <input 
                      name="mobileNo" 
                      placeholder="+91 XXXXX XXXXX" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      value={formData.mobileNo}
                      onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                    />
                  </div>
                </>
              )}

              {user?.role === 'organizer' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Department</label>
                    <select 
                      name="department" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="">Select Department</option>
                      <option value="CSE">CSE</option>
                      <option value="AIML">AIML</option>
                      <option value="MECH">MECH</option>
                      <option value="CIVIL">CIVIL</option>
                      <option value="E&TC">E&TC</option>
                      <option value="MBA">MBA</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Mobile Number</label>
                    <input 
                      name="mobileNo" 
                      placeholder="+91 XXXXX XXXXX" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      value={formData.mobileNo}
                      onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Contact Email</label>
                    <input 
                      type="email"
                      name="contactEmail" 
                      placeholder="contact@college.edu" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                  </div>
                </>
              )}

              <button 
                type="submit" 
                disabled={submitting}
                className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition mt-4 ${
                  submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                }`}
              >
                {submitting ? 'Updating Profile...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
