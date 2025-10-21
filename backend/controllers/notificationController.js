const Notification = require('../models/notification.js');

exports.sendNotification = async (req, res, next) => {
  try {
    const { userId, message, type } = req.body;
    const note = await Notification.create({ userId, message, type });
    res.status(201).json(note);
  } catch (err) { next(err); }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const items = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { next(err); }
};
