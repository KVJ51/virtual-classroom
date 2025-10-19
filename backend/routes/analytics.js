const express = require('express');
const router = express.Router();
const { protect } = require('D:\Subjects\FSWD\virtual-classroom\backend\middleware\auth.js');
const analyticsController = require('D:\Subjects\FSWD\virtual-classroom\backend\controllers\analyticsController.js');

router.get('/student/:id', protect, analyticsController.studentAnalytics);
router.get('/classroom/:id', protect, analyticsController.classroomAnalytics);

module.exports = router;
