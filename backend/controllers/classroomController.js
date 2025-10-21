const Classroom = require('../models/classroom.js');   
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

exports.createClassroom = async (req, res, next) => {
  try {
    const { name, subject, schedule } = req.body;
    const code = crypto.randomBytes(3).toString('hex');
    const classroom = await Classroom.create({
      name, subject, code, teacherId: req.user._id, schedule
    });
    res.status(201).json(classroom);
  } catch (err) { next(err); }
};

exports.getClassroom = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id).populate('teacherId', 'name email').populate('students', 'name email');
    if (!classroom) return res.status(404).json({ message: 'Not found' });
    res.json(classroom);
  } catch (err) { next(err); }
};

exports.joinClassroom = async (req, res, next) => {
  try {
    const { code } = req.body;
    const classroom = await Classroom.findOne({ code });
    if (!classroom) return res.status(404).json({ message: 'Invalid code' });
    if (classroom.students.includes(req.user._id)) return res.json({ message: 'Already joined' });
    classroom.students.push(req.user._id);
    await classroom.save();
    res.json({ message: 'Joined', classroomId: classroom._id });
  } catch (err) { next(err); }
};

exports.uploadMaterial = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) return res.status(404).json({ message: 'Not found' });

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // For now we store local path. Replace with Cloudinary/S3 in production.
    const savePath = `/uploads/${req.file.filename}-${req.file.originalname}`;
    fs.renameSync(req.file.path, path.join(process.cwd(), 'uploads', `${req.file.filename}-${req.file.originalname}`));
    classroom.materials.push(savePath);
    await classroom.save();
    res.json({ message: 'Uploaded', path: savePath });
  } catch (err) { next(err); }
};
