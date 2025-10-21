const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.js');
const analyticsController = require('../controllers/analyticsController.js');

router.get('/student/:id', protect, analyticsController.studentAnalytics);
router.get('/classroom/:id', protect, analyticsController.classroomAnalytics);

module.exports = router;
