const express = require('express');
const router = express.Router();
const { protect } = require('D:\Subjects\FSWD\virtual-classroom\backend\middleware\auth.js');
const notificationController = require('D:\Subjects\FSWD\virtual-classroom\backend\controllers\notificationController.js');

router.post('/send', protect, notificationController.sendNotification);
router.get('/:userId', protect, notificationController.getNotifications);

module.exports = router;
