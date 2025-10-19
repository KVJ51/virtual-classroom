const express = require('express');
const router = express.Router();
const { protect } = require('D:\Subjects\FSWD\virtual-classroom\backend\middleware\auth.js');
const userController = require('D:/Subjects/FSWD/virtual-classroom/backend/controllers/userController.js');

router.get('/me', protect, userController.getMe);
router.put('/update', protect, userController.updateProfile);

module.exports = router;
