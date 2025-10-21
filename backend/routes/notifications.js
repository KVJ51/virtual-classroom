const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.js');
const notificationController = require('../controllers/notificationController.js');

router.post('/send', protect, notificationController.sendNotification);
router.get('/:userId', protect, notificationController.getNotifications);

module.exports = router;
