const User = require('D:/Subjects/FSWD/virtual-classroom/backend/models/user.js');
const bcrypt = require('bcryptjs');

exports.getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.password, salt);
    }
    if (req.body.avatarUrl) updates.avatarUrl = req.body.avatarUrl;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) { next(err); }
};
