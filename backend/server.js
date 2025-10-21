require('dotenv').config();
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db.js');
const socketHandler = require('./socket');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
});

// connect DB
connectDB();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/users', require('./routes/users.js'));
app.use('/api/classrooms', require('./routes/classrooms.js'));
app.use('/api/messages', require('./routes/messages.js'));
app.use('/api/quizzes', require('./routes/quizzes.js'));
app.use('/api/analytics', require('./routes/analytics.js'));
app.use('/api/notifications', require('./routes/notifications.js'));
app.use('/api/admin', require('./routes/admin.js'));

// basic health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// attach socket
socketHandler(io);

// global error handler (basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
