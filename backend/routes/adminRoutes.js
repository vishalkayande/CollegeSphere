const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  approveOrganizer,
  deleteUser,
  deleteEvent,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardData);
router.put('/approve-organizer/:id', approveOrganizer);
router.delete('/user/:id', deleteUser);
router.delete('/event/:id', deleteEvent);

module.exports = router;
