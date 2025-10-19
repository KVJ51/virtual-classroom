const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: [String],
  score: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);
