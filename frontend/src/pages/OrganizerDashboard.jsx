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
    department: 'ALL',
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size too large. Please select an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const API_URL = 'http://localhost:5002'; // Define API URL for consistency

  const fetchAllEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/events?college=${user.collegeName}`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await axios.post(`${API_URL}/api/events`, formData, config);
      setShowModal(false);
      fetchAllEvents(); // Refresh events list
      setFormData({ // Reset form data
        name: '',
        level: 'institute',
        category: '',
        description: '',
        url: '',
        upiId: '',
        photo: '',
        date: '',
        time: '',
        department: 'ALL',
      });
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        await axios.delete(`${API_URL}/api/events/${eventId}`, config);
        fetchAllEvents(); // Refresh after delete
      } catch (err) {
        console.error('Delete Error:', err);
        alert(err.response?.data?.message || 'Failed to delete event');
      }
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

      // Create CSV header
      let csvContent = "Student Name,Email,Mobile No,Department,Year,Class,Roll No,Registration Date,Registration Time\n";

      // Add student data
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
        
        // Escape quotes and commas
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

      // Download file
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
      alert(err.response?.data?.message || 'Failed to download registrations');
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
                        <button 
                          onClick={() => handleDownloadCSV(event._id, event.name)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" 
                          title="Download Registrations CSV"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                      {event.organizer?._id === user?._id && (
                        <button 
                          onClick={() => handleDelete(event._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" 
                          title="Delete Event"
                        >
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

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Event Image</label>
                <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl transition hover:border-blue-400">
                  {imagePreview ? (
                    <div className="relative w-full md:w-32 h-32 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData({ ...formData, photo: '' });
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition"
                      >
                        <Plus className="w-3 h-3 rotate-45" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full md:w-32 h-32 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                      <Tag className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-sm font-bold text-gray-700 mb-1">Upload directly from device</p>
                    <p className="text-xs text-gray-400 mb-3">JPG, PNG or GIF. Max 5MB.</p>
                    <label className="inline-block cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition">
                      Select File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
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
