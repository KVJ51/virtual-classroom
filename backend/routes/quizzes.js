const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.js');
const { authorizeRoles } = require('../middleware/role.js');
const quizController = require('../controllers/quizController.js');

router.post('/create', protect, authorizeRoles('teacher'), quizController.createQuiz);
router.get('/:classroomId', protect, quizController.getByClassroom);
router.post('/submit', protect, quizController.submitQuiz);
router.get('/results/:studentId', protect, quizController.getResultsForStudent);

module.exports = router;
