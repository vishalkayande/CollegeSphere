const Event = require('../models/eventModel');
const User = require('../models/userModel');

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer)
const createEvent = async (req, res) => {
  const { name, level, department, category, description, url, upiId, photo, date, time, registrationLimit } = req.body;

  if (!name || !level || !description || !date || !time) {
    return res.status(400).json({ message: 'Please add all required fields' });
  }

  const event = await Event.create({
    organizer: req.user._id,
    college: req.user.collegeName,
    name,
    level,
    department: level === 'department' ? department : 'ALL',
    category,
    description,
    url,
    upiId,
    registrationLimit: parseInt(registrationLimit) || 0,
    photo,
    date,
    time,
  });

  if (event) {
    res.status(201).json(event);
  } else {
    res.status(400).json({ message: 'Invalid event data' });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  const { level, college } = req.query;
  let query = {};

  if (level) query.level = level;
  if (college) query.college = college;

  const events = await Event.find(query).populate('organizer', 'name email organizerDetails');
  res.json(events);
};

// @desc    Enroll in an event
// @route   POST /api/events/:id/enroll
// @access  Private (Student)
const enrollEvent = async (req, res) => {
  const { mobileNo, email } = req.body;
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Check deadline
  const deadline = new Date(`${event.date.toISOString().split('T')[0]}T${event.time}`);
  if (new Date() > deadline) {
    return res.status(400).json({ message: 'Event registrations expired' });
  }

  // Check if paused
  if (event.isPaused) {
    return res.status(400).json({ message: 'Registration paused by organizer' });
  }

  // Check capacity limit
  if (event.registrationLimit > 0 && event.registrations.length >= event.registrationLimit) {
    return res.status(400).json({ message: 'Event registration limit reached' });
  }

  // Check if already registered
  const alreadyRegistered = event.registrations.find(
    (reg) => reg.student.toString() === req.user._id.toString()
  );

  if (alreadyRegistered) {
    return res.status(400).json({ message: 'Already registered' });
  }

  event.registrations.push({
    student: req.user._id,
    mobileNo,
    email: email || req.user.email,
  });

  await event.save();
  res.status(201).json({ message: 'Successfully registered' });
};

// @desc    Get event registrations (CSV export logic would go here)
// @route   GET /api/events/:id/registrations
// @access  Private (Organizer/Admin)
const getRegistrations = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('registrations.student', 'name studentDetails');

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Check if authorized
  if (req.user.role !== 'admin' && event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  res.json(event.registrations);
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer/Admin)
const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Check if authorized (only owner or admin can delete)
  if (req.user.role !== 'admin' && event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await event.deleteOne();
  res.json({ message: 'Event removed' });
};

// @desc    Toggle pause event
// @route   PUT /api/events/:id/pause
// @access  Private (Organizer)
const togglePauseEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Check if authorized
  if (event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  event.isPaused = !event.isPaused;
  await event.save();

  res.json(event);
};

module.exports = {
  createEvent,
  getEvents,
  enrollEvent,
  getRegistrations,
  deleteEvent,
  togglePauseEvent,
};
