const User = require('../models/userModel');
const Event = require('../models/eventModel');

// @desc    Get all data for admin dashboard
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardData = async (req, res) => {
  const students = await User.find({ role: 'student' }).select('-password');
  const organizers = await User.find({ role: 'organizer' }).select('-password');
  const events = await Event.find({}).populate('organizer', 'name collegeName');
  
  // Group by college for hierarchical view
  const colleges = [...new Set(students.map(s => s.collegeName).concat(organizers.map(o => o.collegeName)))];
  
  const hierarchicalData = colleges.map(college => ({
    college,
    students: students.filter(s => s.collegeName === college),
    organizers: organizers.filter(o => o.collegeName === college),
    events: events.filter(e => e.college === college),
  }));

  res.json(hierarchicalData);
};

// @desc    Approve organizer
// @route   PUT /api/admin/approve-organizer/:id
// @access  Private (Admin)
const approveOrganizer = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user && user.role === 'organizer') {
    user.isApproved = true;
    await user.save();
    res.json({ message: 'Organizer approved' });
  } else {
    res.status(404).json({ message: 'Organizer not found' });
  }
};

// @desc    Delete user (student or organizer)
// @route   DELETE /api/admin/user/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Delete event
// @route   DELETE /api/admin/event/:id
// @access  Private (Admin)
const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
};

module.exports = {
  getDashboardData,
  approveOrganizer,
  deleteUser,
  deleteEvent,
};
