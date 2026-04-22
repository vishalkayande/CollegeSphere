const Event = require('../models/eventModel');
const User = require('../models/userModel');

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer)
const createEvent = async (req, res) => {
  const { name, level, department, category, description, url, upiId, photo, date, time } = req.body;

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
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Check if already enrolled
  const alreadyEnrolled = event.registrations.find(
    (reg) => reg.student.toString() === req.user._id.toString()
  );

  if (alreadyEnrolled) {
    return res.status(400).json({ message: 'Already enrolled in this event' });
  }

  const registration = {
    student: req.user._id,
    mobileNo: req.body.mobileNo,
    email: req.body.email || req.user.email,
  };

  event.registrations.push(registration);
  await event.save();

  res.status(200).json({ message: 'Enrolled successfully' });
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

module.exports = {
  createEvent,
  getEvents,
  enrollEvent,
  getRegistrations,
};
