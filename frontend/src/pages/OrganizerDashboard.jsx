import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Users, Download, Trash2, ExternalLink, Calendar as CalendarIcon, Clock, Tag } from 'lucide-react';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    level: 'institute',
    category: '',
    description: '',
    url: '',
    upiId: '',
    photo: '',
    date: '',
    time: '',
  });

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5002/api/events?college=${user.collegeName}`);
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllEvents();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        await axios.post('http://127.0.0.1:5002/api/events', formData, config);
        setShowModal(false);
      // Refresh events...
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex items-center gap-6">
          <img src="/logo.png" alt="CollegeSphere Logo" className="h-24 w-auto drop-shadow-md" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
            <p className="text-gray-500 mt-1 font-medium">Manage your events and registrations for {user.collegeName}</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-black text-lg shadow-lg shadow-blue-200 transition"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Events</p>
          <h2 className="text-3xl font-bold text-gray-900">{events.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="bg-yellow-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-yellow-600">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Registrations</p>
          <h2 className="text-3xl font-bold text-gray-900">
            {events.reduce((acc, curr) => acc + curr.registrations.length, 0)}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="bg-red-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-red-600">
            <Download className="w-6 h-6" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Reports Exported</p>
          <h2 className="text-3xl font-bold text-gray-900">0</h2>
        </div>
      </div>

      {/* Event List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Event Name</th>
                <th className="px-6 py-4">Organizer</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Registrations</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{event.name}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{event.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-700">{event.organizer?.name}</div>
                    <div className="text-[10px] text-gray-400">{event.organizer?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4 text-blue-500" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      {event.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      {event.level === 'department' ? 'DEPARTMENT' : (event.category || event.level)}
                    </span>
                    {event.level === 'department' && (
                      <div className="text-[10px] font-black text-blue-400 mt-1 ml-1 tracking-tighter">
                        {event.department}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-bold text-gray-700">
                      <Users className="w-4 h-4 text-gray-400" />
                      {event.registrations.length}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {event.organizer?._id === user?._id && (
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Registrations">
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                      {event.organizer?._id === user?._id && (
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete Event">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Event Name</label>
                <input
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Level</label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value, department: e.target.value === 'department' ? formData.department : 'ALL' })}
                >
                  <option value="institute">Institute Level</option>
                  <option value="department">Department Level</option>
                  <option value="club">Club Level</option>
                </select>
              </div>

              {formData.level === 'department' && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Target Department</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
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
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <input
                  placeholder="e.g. Technical"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Time</label>
                <input
                  type="time"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                <textarea
                  required
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">UPI ID (for payments)</label>
                <input
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Event Image URL</label>
                <input
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                />
              </div>

              <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition mt-4">
                Launch Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
