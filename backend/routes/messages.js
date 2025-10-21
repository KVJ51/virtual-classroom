const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.js');
const { authorizeRoles } = require('../middleware/role.js');
const messageController = require('../controllers/messageController.js');

router.get('/classroom/:id', protect, messageController.getByClassroom);
router.delete('/:id', protect, authorizeRoles('admin','teacher'), messageController.deleteMessage);

module.exports = router;
