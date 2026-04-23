import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LayoutGrid, Building2, Users, Search, MapPin, Calendar, Clock, ChevronRight, Info, CreditCard } from 'lucide-react';

const StudentDashboard = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('institute');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const API_URL = 'http://localhost:5002';

  useEffect(() => {
    // Only show modal if studentDetails are completely missing or branch is not set
    if (user && user.role === 'student' && (!user.studentDetails || !user.studentDetails.branch)) {
      setShowProfileModal(true);
    } else {
      setShowProfileModal(false);
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/events?level=${activeTab}&college=${user.collegeName}`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.collegeName) {
      fetchEvents();
    }
  }, [activeTab, user]);

  const handleRegister = async (eventId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const registrationData = {
        mobileNo: user.studentDetails?.mobileNo || '',
        email: user.email
      };
      
      await axios.post(`${API_URL}/api/events/${eventId}/enroll`, registrationData, config);
      alert('Successfully registered for the event!');
      fetchEvents(); // Refresh events to show "Registered" status
    } catch (err) {
      console.error('Registration Error:', err);
      alert(err.response?.data?.message || 'Failed to register for event');
    }
  };

  const isRegistered = (event) => {
    return event.registrations?.some(reg => reg.student === user._id || reg.student?._id === user._id);
  };

  const isExpired = (event) => {
    const deadline = new Date(`${event.date}T${event.time}`);
    return new Date() > deadline;
  };

  const isEligible = (event) => {
    if (event.level === 'department') {
      return event.department === 'ALL' || event.department === user?.studentDetails?.branch;
    }
    return true; // Institute and Club levels are open to all students in the college
  };

  const tabs = [
    { id: 'institute', label: 'Institute Level', icon: Building2 },
    { id: 'department', label: 'Department Level', icon: LayoutGrid },
    { id: 'club', label: 'Club Level', icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-10 flex flex-col md:flex-row items-center gap-6">
        <img src="/logo.png" alt="CollegeSphere Logo" className="h-24 w-auto drop-shadow-md" />
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Discover <span className="text-blue-600">Events</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium">Find and register for upcoming events in your college.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-6 mb-8 bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black text-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-[#003B5C] hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search events by name, organizer..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      {/* Event Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100"></div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
            >
              {/* Event Image */}
              <div className="h-52 overflow-hidden relative">
                <img
                  src={event.photo || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80'}
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {event.category || 'Event'}
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
                  {event.name}
                </h3>

                {/* Event Description */}
                <div className="mb-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    <Info className="w-3 h-3" /> Description
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className={`flex items-center gap-2 text-sm ${isExpired(event) ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                    <Calendar className={`w-4 h-4 ${isExpired(event) ? 'text-red-500' : 'text-blue-500'}`} />
                    <span className="font-medium">Registration Deadline:</span>
                    <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${isExpired(event) ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                    <Clock className={`w-4 h-4 ${isExpired(event) ? 'text-red-500' : 'text-yellow-500'}`} />
                    <span>{event.time}</span>
                    {isExpired(event) && <span className="ml-1 text-[10px] uppercase tracking-tighter">(Expired)</span>}
                  </div>
                  <div className="flex items-center text-gray-500 gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="truncate">{event.college}</span>
                  </div>
                  {event.registrationLimit > 0 && (
                    <div className="flex items-center text-gray-500 gap-2 text-sm">
                      <Users className={`w-4 h-4 ${event.registrations.length >= event.registrationLimit ? 'text-red-500' : 'text-green-500'}`} />
                      <span className="font-medium">Capacity:</span>
                      <span className={event.registrations.length >= event.registrationLimit ? 'text-red-500 font-bold' : ''}>
                        {event.registrations.length} / {event.registrationLimit}
                      </span>
                    </div>
                  )}
                </div>

                {/* UPI Details - Only shown for registered students */}
                {isRegistered(event) && event.upiId && (
                  <div className="mb-6 bg-blue-50/50 p-3 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                      <CreditCard className="w-3 h-3" /> Payment Details
                    </div>
                    <p className="text-sm font-bold text-blue-700 select-all">UPI ID: {event.upiId}</p>
                    <p className="text-[10px] text-blue-400 mt-1 italic">Please complete payment to confirm your slot.</p>
                  </div>
                )}

                {/* Organizer Contact Details */}
                <div className="mb-6 pt-4 border-t border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Organizer Contact</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-gray-700">{event.organizer?.name} <span className="text-[10px] text-blue-400">({event.organizer?.organizerDetails?.department || 'Dept'})</span></p>
                    <p className="text-xs text-gray-500">{event.organizer?.organizerDetails?.contactEmail || event.organizer?.email}</p>
                    <p className="text-xs text-gray-500">{event.organizer?.organizerDetails?.mobileNo || 'Contact N/A'}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleRegister(event._id)}
                  disabled={!isEligible(event) || isRegistered(event) || isExpired(event) || event.isPaused || (event.registrationLimit > 0 && event.registrations.length >= event.registrationLimit)}
                  className={`mt-auto w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl transition-all duration-200 group/btn ${
                    !isEligible(event) || isRegistered(event) || isExpired(event) || event.isPaused || (event.registrationLimit > 0 && event.registrations.length >= event.registrationLimit)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed grayscale'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {isRegistered(event) 
                    ? 'Registered ✓' 
                    : (isExpired(event)
                        ? 'Event Registrations Expired'
                        : (event.isPaused
                            ? 'Registration Paused'
                            : (event.registrationLimit > 0 && event.registrations.length >= event.registrationLimit
                                ? 'Registrations Full'
                                : (!isEligible(event)
                                    ? 'Only for ' + event.department
                                    : 'Register Now'))))}
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">No events found</h3>
          <p className="text-gray-500">Try switching categories or check back later.</p>
        </div>
      )}

      {/* Profile Completion Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
              <p className="text-gray-500 mt-2">We need a few more details before you can register for events.</p>
              <div className="flex items-center justify-center gap-4 mt-2">
                <button 
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await axios.get(`${API_URL}/api/ping`);
                      alert('Connection to backend: SUCCESS! ' + res.data.timestamp);
                    } catch (err) {
                      alert('Connection to backend: FAILED! ' + err.message);
                    }
                  }}
                  className="text-[10px] text-blue-500 underline"
                >
                  Test Connection
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('user');
                    window.location.reload();
                  }}
                  className="text-[10px] text-red-500 underline"
                >
                  Force Reset Session
                </button>
              </div>
            </div>

            {formError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs font-bold border border-red-100">
                {formError}
              </div>
            )}

            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              setFormError('');
              const formData = new FormData(e.target);
              const details = Object.fromEntries(formData.entries());
              console.log('Updating profile with details:', details);
              try {
                if (!user?.token) {
                  throw new Error('Authentication token is missing. Please login again.');
                }
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                  };
                  console.log('Request Config:', config);
                  const response = await axios.put(`${API_URL}/api/users/profile`, details, config);
                  console.log('Update Success:', response.data);
                updateUser(response.data);
                // setShowProfileModal is now reactive to user state
              } catch (err) {
                console.error('Update Profile Error Details:', err);
                setFormError(err.response?.data?.message || err.message || 'Failed to update profile. Please check your connection.');
              } finally {
                setSubmitting(false);
              }
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Branch (Dept)</label>
                  <select 
                    name="branch" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
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
                  <input name="year" required placeholder="e.g. 3rd" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Class & Roll No</label>
                <div className="grid grid-cols-2 gap-4">
                  <input name="class" required placeholder="Class" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  <input name="rollNo" required placeholder="Roll No" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Mobile Number</label>
                <input name="mobileNo" required placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition mt-4 ${
                  submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                }`}
              >
                {submitting ? 'Updating Profile...' : 'Save & Continue'}
              </button>

              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="text-gray-400 hover:text-red-500 text-xs font-medium transition"
                >
                  Not you? Logout and switch account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
