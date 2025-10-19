import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (userId, thunkAPI) => {
  try {
    const res = await api.get(`/api/notifications/${userId}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Failed to fetch notifications');
  }
});

const slice = createSlice({
  name: 'notifications',
  initialState: { list: [] },
  reducers: {
    pushNotification(state, action) { state.list.unshift(action.payload); }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (s,a)=>{ s.list = a.payload; });
  }
});

export const { pushNotification } = slice.actions;
export default slice.reducer;
