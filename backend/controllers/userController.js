const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/users/signup
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, collegeName, role, department, mobileNo, contactEmail } = req.body;

  if (!name || !email || !password || (role !== 'admin' && !collegeName)) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    collegeName,
    role: role || 'student',
    isApproved: role === 'organizer' ? false : true, // Organizers need approval
    organizerDetails: role === 'organizer' ? {
      department,
      mobileNo,
      contactEmail,
    } : undefined,
  });

  if (user) {
    // If user is organizer, don't return token yet, wait for approval
    if (user.role === 'organizer') {
      return res.status(201).json({
        message: 'Organizer account created. Please wait for Admin approval before logging in.',
        role: user.role,
        _id: user.id,
        name: user.name,
        email: user.email,
        collegeName: user.collegeName,
        organizerDetails: user.organizerDetails,
      });
    }

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      collegeName: user.collegeName,
      studentDetails: user.studentDetails,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.role === 'organizer' && !user.isApproved) {
      return res.status(401).json({ message: 'Organizer account pending approval' });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      collegeName: user.collegeName,
      studentDetails: user.studentDetails,
      organizerDetails: user.organizerDetails,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Update student profile
// @route   PUT /api/users/profile
// @access  Private (Student)
const updateProfile = async (req, res) => {
  try {
    console.log('Update Profile Request:', req.body);
    const user = await User.findById(req.user._id);

    if (user) {
      // Safety check for collegeName which is required for non-admins
      if (user.role !== 'admin' && !user.collegeName) {
        console.warn('User missing collegeName, setting a default for safety');
        user.collegeName = 'Unknown College';
      }

      user.studentDetails = {
        class: req.body.class || (user.studentDetails && user.studentDetails.class),
        rollNo: req.body.rollNo || (user.studentDetails && user.studentDetails.rollNo),
        branch: req.body.branch || (user.studentDetails && user.studentDetails.branch),
        year: req.body.year || (user.studentDetails && user.studentDetails.year),
        mobileNo: req.body.mobileNo || (user.studentDetails && user.studentDetails.mobileNo),
      };

      const updatedUser = await user.save();
      console.log('User Profile Updated Successfully');

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        collegeName: updatedUser.collegeName,
        studentDetails: updatedUser.studentDetails,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update Profile Error Name:', error.name);
    console.error('Update Profile Error Message:', error.message);
    if (error.errors) {
      console.error('Validation Errors:', Object.keys(error.errors).map(key => `${key}: ${error.errors[key].message}`));
    }
    res.status(500).json({ message: 'Server error while updating profile: ' + error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};
