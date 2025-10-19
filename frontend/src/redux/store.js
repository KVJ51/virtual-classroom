import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import classroomReducer from './slices/classroomSlice.js';
import chatReducer from './slices/chatSlice.js';
import quizReducer from './slices/quizSlice.js';
import notificationReducer from './slices/notificationSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classrooms: classroomReducer,
    chat: chatReducer,
    quizzes: quizReducer,
    notifications: notificationReducer,
  },
});
