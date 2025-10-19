const express = require('express');
const router = express.Router();
const authController = require('D:\Subjects\FSWD\virtual-classroom\backend\controllers\authController.js');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
