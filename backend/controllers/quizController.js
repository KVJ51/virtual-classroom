const Quiz = require('D:\Subjects\FSWD\virtual-classroom\backend\models\quiz.js');
const QuizResult = require('D:\Subjects\FSWD\virtual-classroom\backend\models\quizresult.js');

exports.createQuiz = async (req, res, next) => {
  try {
    const { classroomId, title, questions, timeLimitMinutes } = req.body;
    const quiz = await Quiz.create({ classroomId, title, questions, createdBy: req.user._id, timeLimitMinutes });
    res.status(201).json(quiz);
  } catch (err) { next(err); }
};

exports.getByClassroom = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ classroomId: req.params.classroomId }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) { next(err); }
};

exports.submitQuiz = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // simple auto-eval
    let score = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      if (answers[i] === quiz.questions[i].correctAnswer) score++;
    }
    const percent = Math.round((score / quiz.questions.length) * 100);

    const result = await QuizResult.create({
      quizId, studentId: req.user._id, answers, score: percent
    });

    res.json({ result });
  } catch (err) { next(err); }
};

exports.getResultsForStudent = async (req, res, next) => {
  try {
    const results = await QuizResult.find({ studentId: req.params.studentId }).populate('quizId', 'title');
    res.json(results);
  } catch (err) { next(err); }
};
