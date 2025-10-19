const express = require('express');
const router = express.Router();
const { protect } = require('D:\Subjects\FSWD\virtual-classroom\backend\middleware\auth.js');
const { authorizeRoles } = require('D:\Subjects\FSWD\virtual-classroom\backend\middleware\role.js');
const messageController = require('D:\Subjects\FSWD\virtual-classroom\backend\controllers\messageController.js');

router.get('/classroom/:id', protect, messageController.getByClassroom);
router.delete('/:id', protect, authorizeRoles('admin','teacher'), messageController.deleteMessage);

module.exports = router;
