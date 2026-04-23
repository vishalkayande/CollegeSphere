const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  enrollEvent,
  getRegistrations,
  deleteEvent,
  togglePauseEvent,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getEvents)
  .post(protect, authorize('organizer', 'admin'), createEvent);

router.route('/:id')
  .delete(protect, authorize('organizer', 'admin'), deleteEvent);

router.put('/:id/pause', protect, authorize('organizer'), togglePauseEvent);
router.post('/:id/enroll', protect, authorize('student'), enrollEvent);
router.get('/:id/registrations', protect, authorize('organizer', 'admin'), getRegistrations);

module.exports = router;
