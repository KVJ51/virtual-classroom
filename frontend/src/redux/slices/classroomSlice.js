import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

export const fetchMyClassrooms = createAsyncThunk('classrooms/fetchMy', async (_, thunkAPI) => {
  try {
    // backend + seed currently doesn't have endpoint for "my classrooms" - fallback to teacher/classroom id calls.
    const res = await api.get('/api/classrooms'); // if you implement list endpoint
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const slice = createSlice({
  name: 'classrooms',
  initialState: { list: [], current: null, loading: false },
  reducers: {
    setCurrent(state, action) { state.current = action.payload; }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyClassrooms.fulfilled, (s,a)=>{ s.list = a.payload; });
  }
});

export const { setCurrent } = slice.actions;
export default slice.reducer;
