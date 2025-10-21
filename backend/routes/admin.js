const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.js');
const { authorizeRoles } = require('../middleware/role.js');
const adminController = require('../controllers/adminController.js');

router.use(protect, authorizeRoles('admin'));

router.get('/users', adminController.listUsers);
router.get('/classrooms', adminController.listClassrooms);
router.delete('/user/:id', adminController.deleteUser);
router.get('/stats', adminController.stats);

module.exports = router;
