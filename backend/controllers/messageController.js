import Message from '../models/message.js';

export async function getByClassroom(req, res, next) {
  try {
    const messages = await Message.find({ classroomId: req.params.id }).sort({ timestamp: 1 }).populate('senderId', 'name role');
    res.json(messages);
  } catch (err) { next(err); }
}

export async function deleteMessage(req, res, next) {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Not found' });
    await msg.remove();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
}
