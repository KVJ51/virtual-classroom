import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

// ✅ Register user
export const registerUser = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/api/auth/register', payload);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Register failed');
  }
});

// ✅ Login user
export const loginUser = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/api/auth/login', payload);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

// ✅ Fetch current user (optional)
export const fetchMe = createAsyncThunk('auth/me', async (_, thunkAPI) => {
  try {
    const res = await api.get('/api/users/me');
    return res.data;
  } catch {
    return thunkAPI.rejectWithValue(null);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null },
  reducers: {
    logoutLocal: (state) => { state.user = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast.success('Registered successfully');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        toast.success('Logged in');
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logoutLocal } = authSlice.actions;
export default authSlice.reducer;
