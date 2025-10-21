const QuizResult = require('../models/quizresult.js'); // backend\models\quizresult.js
const Quiz = require('../models/quiz.js');
const Classroom = require('../models/classroom.js');

exports.studentAnalytics = async (req, res, next) => {
  try {
    const results = await QuizResult.find({ studentId: req.params.id }).populate('quizId', 'title');
    res.json({ results });
  } catch (err) { next(err); }
};

exports.classroomAnalytics = async (req, res, next) => {
  try {
    const classroomId = req.params.id;
    const quizzes = await Quiz.find({ classroomId });
    const quizIds = quizzes.map(q => q._id);
    const results = await QuizResult.find({ quizId: { $in: quizIds } });
    res.json({ quizzes, results });
  } catch (err) { next(err); }
};
