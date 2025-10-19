const express = require('express');
const router = express.Router();
const { protect } = require('D:\Subjects\FSWD\virtual-classroom\backend\middleware\auth.js');
const { authorizeRoles } = require('D:\Subjects\FSWD\virtual-classroom\backend\middleware\role.js');
const classroomController = require('D:\Subjects\FSWD\virtual-classroom\backend\controllers\classroomController.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/create', protect, authorizeRoles('teacher'), classroomController.createClassroom);
router.get('/:id', protect, classroomController.getClassroom);
router.post('/join', protect, classroomController.joinClassroom);
router.post('/uploadMaterial/:id', protect, authorizeRoles('teacher'), upload.single('file'), classroomController.uploadMaterial);

module.exports = router;
