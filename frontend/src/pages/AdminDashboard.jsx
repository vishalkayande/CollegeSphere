import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Building2, Users, Calendar, ShieldAlert, Trash2, CheckCircle, XCircle, Trophy, ShieldCheck, LayoutGrid, Download } from 'lucide-react';
import Leaderboard from './Leaderboard';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null); // null = welcome state with big logo
  const [orgFilter, setOrgFilter] = useState('ALL');
  const [studentFilter, setStudentFilter] = useState('ALL');
  const [eventFilter, setEventFilter] = useState('ALL');
  const API_URL = 'http://localhost:5002'; // Define API URL for consistency

  const isExpired = (event) => {
    const deadline = new Date(`${event.date.split('T')[0]}T${event.time}`);
    return new Date() > deadline;
  };

  const fetchAdminData = async () => {
    try {
      const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        const res = await axios.get(`${API_URL}/api/admin/dashboard`, config);
        setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/events`);
      setAllEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'admin') fetchAdminData();
    if (activeTab === 'events') fetchAllEvents();
  }, [user, activeTab]);

  const handleApprove = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_URL}/api/admin/approve-organizer/${id}`, {}, config);
      fetchAdminData();
    } catch (err) {
      alert('Failed to approve organizer');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/api/admin/user/${id}`, config);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/api/admin/event/${id}`, config);
      if (activeTab === 'admin') fetchAdminData();
      if (activeTab === 'events') fetchAllEvents();
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  const handleDownloadCSV = async (eventId, eventName) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const res = await axios.get(`${API_URL}/api/events/${eventId}/registrations`, config);
      const registrations = res.data;

      if (registrations.length === 0) {
        alert('No registrations found for this event');
        return;
      }

      let csvContent = "Student Name,Email,Mobile No,Department,Year,Class,Roll No,Registration Date,Registration Time\n";
      registrations.forEach(reg => {
        const name = reg.student?.name || 'N/A';
        const email = reg.email || reg.student?.email || 'N/A';
        const mobile = reg.mobileNo || 'N/A';
        const dept = reg.student?.studentDetails?.branch || 'N/A';
        const year = reg.student?.studentDetails?.year || 'N/A';
        const className = reg.student?.studentDetails?.class || 'N/A';
        const rollNo = reg.student?.studentDetails?.rollNo || 'N/A';
        
        // Handle Registration Date and Time
        const regDateObj = reg.registeredAt ? new Date(reg.registeredAt) : null;
        const regDate = regDateObj ? regDateObj.toLocaleDateString() : 'N/A';
        const regTime = regDateObj ? regDateObj.toLocaleTimeString() : 'N/A';
        
        const row = [
          `"${name.replace(/"/g, '""')}"`,
          `"${email.replace(/"/g, '""')}"`,
          `"${mobile.replace(/"/g, '""')}"`,
          `"${dept.replace(/"/g, '""')}"`,
          `"${year.replace(/"/g, '""')}"`,
          `"${className.replace(/"/g, '""')}"`,
          `"${rollNo.replace(/"/g, '""')}"`,
          `"${regDate}"`,
          `"${regTime}"`
        ].join(",");
        csvContent += row + "\n";
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${eventName.replace(/\s+/g, '_')}_registrations.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download Error:', err);
      alert('Failed to download registrations');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Navigation Tabs */}
      <div className="flex justify-center gap-6 mb-12 bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100 w-fit mx-auto">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-10 py-4 rounded-xl font-black text-lg transition-all ${
            activeTab === 'events' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'text-[#003B5C] hover:bg-gray-50 hover:text-blue-600'
          }`}
        >
          <Calendar className="w-6 h-6" />
          Events
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 px-10 py-4 rounded-xl font-black text-lg transition-all ${
            activeTab === 'leaderboard' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'text-[#003B5C] hover:bg-gray-50 hover:text-blue-600'
          }`}
        >
          <Trophy className="w-6 h-6" />
          Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex items-center gap-2 px-10 py-4 rounded-xl font-black text-lg transition-all ${
            activeTab === 'admin' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'text-[#003B5C] hover:bg-gray-50 hover:text-blue-600'
          }`}
        >
          <ShieldCheck className="w-6 h-6" />
          Admin
        </button>
      </div>

      {/* Conditional Content */}
      {!activeTab && (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-700">
          <img src="/logo.png" alt="CollegeSphere Logo" className="w-96 h-auto mb-8 drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4">
            Welcome to <span className="text-[#003B5C]">College</span><span className="text-[#00B5AD]">Sphere</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl text-center leading-relaxed font-medium">
            Your centralized command center for academic excellence. 
            Select a module from above to manage events, track rankings, or access the admin console.
          </p>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10 flex items-center gap-6">
            <img src="/logo.png" alt="CollegeSphere Logo" className="h-16 w-auto drop-shadow-sm" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Campus Events</h1>
              <p className="text-gray-500 mt-1">Full visibility of every event scheduled across the platform.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allEvents.map((event) => (
              <div key={event._id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col">
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={event.photo || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80'} 
                    alt={event.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 uppercase">
                    {event.level}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{event.name}</h3>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleDownloadCSV(event._id, event.name)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                        title="Download Registrations CSV"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEvent(event._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition"
                        title="Delete Event"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-2 border-t pt-4 mt-auto">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" /> {event.college}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400">
                      <Users className="w-3.5 h-3.5 text-yellow-400" /> {event.organizer?.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Leaderboard />
        </div>
      )}

      {activeTab === 'admin' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10 flex items-center gap-6">
            <img src="/logo.png" alt="CollegeSphere Logo" className="h-16 w-auto drop-shadow-sm" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
              <p className="text-gray-500 mt-1 font-medium italic">Global management of organizers and students.</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2].map(n => (
                <div key={n} className="bg-white h-64 rounded-3xl animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : data.length > 0 ? (
            <div className="space-y-12">
              {data.map((college) => {
                const orgBranches = ['ALL', ...new Set(college.organizers.map(o => o.organizerDetails?.department).filter(Boolean))];
                const studentBranches = ['ALL', ...new Set(college.students.map(s => s.studentDetails?.branch).filter(Boolean))];
                const eventStatuses = ['ALL', 'LIVE', 'EXPIRED'];

                return (
                  <div key={college.college} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    {/* College Header */}
                    <div className="bg-blue-600 px-8 py-6 flex items-center justify-between text-white">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                          <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{college.college}</h2>
                          <p className="text-blue-100 text-sm">{college.students.length} Students • {college.organizers.length} Organizers</p>
                        </div>
                      </div>
                      <div className="bg-white/10 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm border border-white/10">
                        {college.events.length} Active Events
                      </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Organizers List */}
                      <div className="space-y-4">
                        <div className="flex flex-col gap-4 mb-4">
                          <h3 className="font-black text-gray-900 flex items-center gap-2 text-lg uppercase tracking-tight">
                            <ShieldAlert className="w-5 h-5 text-yellow-500" />
                            Organizers
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {orgBranches.map(branch => (
                              <button
                                key={branch}
                                onClick={() => setOrgFilter(branch)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                                  orgFilter === branch 
                                    ? 'bg-yellow-500 text-white shadow-md shadow-yellow-100' 
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }`}
                              >
                                {branch}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                          {college.organizers
                            .filter(org => orgFilter === 'ALL' || org.organizerDetails?.department === orgFilter)
                            .map(org => (
                            <div key={org._id} className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-transparent hover:border-yellow-200 transition">
                              <div>
                                <p className="font-bold text-gray-800 text-sm">{org.name}</p>
                                <p className="text-gray-400 text-xs">{org.email}</p>
                                <p className="text-blue-500 text-[10px] font-bold mt-1 uppercase tracking-wider">
                                  {org.organizerDetails?.department || 'Organizer'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {!org.isApproved && (
                                  <button 
                                    onClick={() => handleApprove(org._id)}
                                    className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition"
                                    title="Approve Organizer"
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDeleteUser(org._id)}
                                  className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition"
                                  title="Delete Organizer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Students List */}
                      <div className="space-y-4 border-x border-gray-50 px-4">
                        <div className="flex flex-col gap-4 mb-4">
                          <h3 className="font-black text-gray-900 flex items-center gap-2 text-lg uppercase tracking-tight">
                            <Users className="w-5 h-5 text-blue-500" />
                            Students
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {studentBranches.map(branch => (
                              <button
                                key={branch}
                                onClick={() => setStudentFilter(branch)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                                  studentFilter === branch 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }`}
                              >
                                {branch}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                          {college.students
                            .filter(s => studentFilter === 'ALL' || s.studentDetails?.branch === studentFilter)
                            .map(student => (
                            <div key={student._id} className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-transparent hover:border-blue-200 transition">
                              <div>
                                <p className="font-bold text-gray-800 text-sm">{student.name}</p>
                                <p className="text-gray-400 text-xs">{student.email}</p>
                                <p className="text-blue-600 text-[10px] font-bold mt-1 uppercase tracking-wider">
                                  {student.studentDetails?.branch || 'General Student'}
                                </p>
                              </div>
                              <button 
                                onClick={() => handleDeleteUser(student._id)}
                                className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition"
                                title="Delete Student"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Events List */}
                      <div className="space-y-4">
                        <div className="flex flex-col gap-4 mb-4">
                          <h3 className="font-black text-gray-900 flex items-center gap-2 text-lg uppercase tracking-tight">
                            <Calendar className="w-5 h-5 text-red-500" />
                            Events
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {eventStatuses.map(status => (
                              <button
                                key={status}
                                onClick={() => setEventFilter(status)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                                  eventFilter === status 
                                    ? 'bg-red-500 text-white shadow-md shadow-red-100' 
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                          {college.events
                            .filter(e => {
                              if (eventFilter === 'ALL') return true;
                              const expired = isExpired(e);
                              return eventFilter === 'EXPIRED' ? expired : !expired;
                            })
                            .map(event => (
                            <div key={event._id} className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-transparent hover:border-red-200 transition">
                              <div>
                                <p className="font-bold text-gray-800 text-sm">{event.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isExpired(event) ? 'text-red-500' : 'text-green-500'}`}>
                                    {isExpired(event) ? 'Expired' : 'Live'}
                                  </p>
                                  <span className="text-gray-300 text-[10px]">•</span>
                                  <p className="text-gray-400 text-[10px] uppercase">{event.level}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleDeleteEvent(event._id)}
                                className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition"
                                title="Delete Event"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <p className="text-gray-500">No data available yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
