const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.js');
const userController = require('../controllers/userController.js');

router.get('/me', protect, userController.getMe);
router.put('/update', protect, userController.updateProfile);

module.exports = router;
