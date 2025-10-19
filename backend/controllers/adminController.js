const User = require('D:/Subjects/FSWD/virtual-classroom/backend/models/user.js');
const Classroom = require('D:\Subjects\FSWD\virtual-classroom\backend\models\classroom.js');
const Message = require('D:\Subjects\FSWD\virtual-classroom\backend\models\message.js');
const Quiz = require('D:\Subjects\FSWD\virtual-classroom\backend\models\quiz.js');

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) { next(err); }
};

exports.listClassrooms = async (req, res, next) => {
  try {
    const classes = await Classroom.find().populate('teacherId', 'name email');
    res.json(classes);
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // optionally remove related data
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

exports.stats = async (req, res, next) => {
  try {
    const users = await User.countDocuments();
    const classrooms = await Classroom.countDocuments();
    const messages = await Message.countDocuments();
    const quizzes = await Quiz.countDocuments();
    res.json({ users, classrooms, messages, quizzes });
  } catch (err) { next(err); }
};
