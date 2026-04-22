const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

// @desc    Forgot Password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const message = `
      <h1>Password Reset Request</h1>
      <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
      <p>Please click on the following link to reset your password:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `;

    try {
      // For development, we'll use a mock mailer or log the link
      // If SMTP settings are provided in .env, use them
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `${process.env.FROM_NAME || 'CollegeSphere'} <${process.env.FROM_EMAIL || 'noreply@collegesphere.com'}>`,
          to: user.email,
          subject: 'Password Reset Token',
          html: message,
        });

        res.status(200).json({ message: 'Email sent' });
      } else {
        // Fallback for development: Log the token and return it (in real app, only send via email)
        console.log('--- PASSWORD RESET LINK ---');
        console.log(resetUrl);
        console.log('---------------------------');
        res.status(200).json({ 
          message: 'Email sent (Development Mode: Check server console for link)',
          developmentLink: resetUrl // Sending back for easy testing in development
        });
      }
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Reset Password
// @route   PUT /api/users/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      message: 'Password reset successful',
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

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
  forgotPassword,
  resetPassword,
};
