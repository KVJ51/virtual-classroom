const jwt = require('jsonwebtoken');
const Message = require('D:\Subjects\FSWD\virtual-classroom\backend\models\message.js');
const User = require('D:/Subjects/FSWD/virtual-classroom/backend/routes/users.js');

/**
 * Socket handler:
 * - expects cookie 'token' to be present (httpOnly).
 * - will join socket to classroom rooms by client event.
 */
module.exports = (io) => {
  io.use(async (socket, next) => {
    try {
      // extract token from cookie header
      const cookieHeader = socket.handshake.headers.cookie || '';
      const match = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith('token='));
      if (!match) return next(); // allow anonymous sockets for now
      const token = match.split('=')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      socket.user = user;
      next();
    } catch (err) {
      // skip auth - client may still connect for public features
      next();
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id, socket.user ? socket.user.email : 'guest');

    socket.on('joinRoom', (classroomId) => {
      socket.join(`classroom_${classroomId}`);
      socket.emit('joinedRoom', classroomId);
    });

    socket.on('leaveRoom', (classroomId) => {
      socket.leave(`classroom_${classroomId}`);
    });

    socket.on('chatMessage', async (data) => {
      // data: { classroomId, content, receiverId? }
      try {
        if (!socket.user) return socket.emit('error', 'Not authenticated');
        const message = await Message.create({
          classroomId: data.classroomId,
          senderId: socket.user._id,
          receiverId: data.receiverId || null,
          content: data.content
        });
        const out = {
          _id: message._id,
          classroomId: message.classroomId,
          sender: { id: socket.user._id, name: socket.user.name, role: socket.user.role },
          content: message.content,
          timestamp: message.timestamp
        };

        if (data.receiverId) {
          // private message -> emit to specific userId room (if you have user rooms)
          io.to(`user_${data.receiverId}`).emit('privateMessage', out);
          socket.emit('privateMessage', out);
        } else {
          io.to(`classroom_${data.classroomId}`).emit('chatMessage', out);
        }
      } catch (err) {
        console.error('chatMessage error', err);
      }
    });

    socket.on('registerUserRoom', () => {
      if (socket.user) {
        socket.join(`user_${socket.user._id}`);
      }
    });

    socket.on('disconnect', () => {
      // optional cleanup
    });
  });
};
