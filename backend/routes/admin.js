const express = require('express');
const router = express.Router();
const { protect } = require('D:\Subjects\FSWD\virtual-classroom\backend\middleware\auth.js');
const { authorizeRoles } = require('D:\Subjects\FSWD\virtual-classroom\backend\middleware\role.js');
const adminController = require('D:\Subjects\FSWD\virtual-classroom\backend\controllers\adminController.js');

router.use(protect, authorizeRoles('admin'));

router.get('/users', adminController.listUsers);
router.get('/classrooms', adminController.listClassrooms);
router.delete('/user/:id', adminController.deleteUser);
router.get('/stats', adminController.stats);

module.exports = router;
