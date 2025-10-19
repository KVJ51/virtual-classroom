require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('backend/models/user.js');
const Classroom = require('backend/models/classroom.js');
const Quiz = require('backend/models/quiz.js');
const Message = require('backend/models/message.js');
const bcrypt = require('bcryptjs');

const run = async () => {
  try {
    await connectDB();
    // clear
    await User.deleteMany({});
    await Classroom.deleteMany({});
    await Quiz.deleteMany({});
    await Message.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const pwdTeacher = await bcrypt.hash('teacher123', salt);
    const pwdStudent = await bcrypt.hash('student123', salt);
    const pwdAdmin = await bcrypt.hash('admin123', salt);

    const teacher = await User.create({ name: 'Alice Teacher', email: 'alice@school.edu', password: pwdTeacher, role: 'teacher' });
    const student = await User.create({ name: 'Bob Student', email: 'bob@student.edu', password: pwdStudent, role: 'student' });
    const admin = await User.create({ name: 'Super Admin', email: 'admin@site.com', password: pwdAdmin, role: 'admin' });

    const classroom = await Classroom.create({
      name: 'Biology 101',
      subject: 'Biology',
      code: 'abc123',
      teacherId: teacher._id,
      students: [student._id],
      materials: [],
      schedule: new Date()
    });

    const quiz = await Quiz.create({
      classroomId: classroom._id,
      title: 'Cells Basics',
      questions: [
        { questionText: 'Cell is the...', options: ['basic unit', 'organ'], correctAnswer: 'basic unit' },
        { questionText: 'DNA stands for?', options: ['Deoxyribo...','Other'], correctAnswer: 'Deoxyribo...' }
      ],
      createdBy: teacher._id
    });

    await Message.create({
      classroomId: classroom._id,
      senderId: teacher._id,
      content: 'Welcome to Biology 101!'
    });

    console.log('Seed complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
