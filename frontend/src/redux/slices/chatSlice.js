import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'chat',
  initialState: { messages: [] },
  reducers: {
    addMessage(state, action) { state.messages.push(action.payload); },
    setMessages(state, action) { state.messages = action.payload; },
    clearMessages(state) { state.messages = []; }
  }
});

export const { addMessage, setMessages, clearMessages } = slice.actions;
export default slice.reducer;
