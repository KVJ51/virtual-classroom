const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
  correctAnswer: String
});

const QuizSchema = new mongoose.Schema({
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
  title: String,
  questions: [QuestionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timeLimitMinutes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);
