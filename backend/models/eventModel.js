const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    college: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add an event name'],
    },
    level: {
      type: String,
      enum: ['department', 'institute', 'club'],
      required: true,
    },
    department: {
      type: String,
      enum: ['CSE', 'AIML', 'MECH', 'CIVIL', 'E&TC', 'MBA', 'OTHER', 'ALL'],
      default: 'ALL',
    },
    category: {
      type: String, // e.g., 'Technical', 'Cultural', 'Sports'
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    url: String,
    upiId: String,
    photo: String,
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    registrations: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        mobileNo: String,
        email: String,
        registeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
