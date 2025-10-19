const express = require('express');
const router = express.Router();
const { protect } = require('D:\Subjects\FSWD\virtual-classroom\backend\middleware\auth.js');
const { authorizeRoles } = require('D:\Subjects\FSWD\virtual-classroom\backend\middleware\role.js');
const quizController = require('D:\Subjects\FSWD\virtual-classroom\backend\controllers\quizController.js');

router.post('/create', protect, authorizeRoles('teacher'), quizController.createQuiz);
router.get('/:classroomId', protect, quizController.getByClassroom);
router.post('/submit', protect, quizController.submitQuiz);
router.get('/results/:studentId', protect, quizController.getResultsForStudent);

module.exports = router;
