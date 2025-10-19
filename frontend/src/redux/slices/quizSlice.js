import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

export const fetchQuizzes = createAsyncThunk('quizzes/fetch', async (classroomId, thunkAPI) => {
  try {
    const res = await api.get(`/api/quizzes/${classroomId}`);
    return res.data;
  } catch {
    return thunkAPI.rejectWithValue([]);
  }
});

const slice = createSlice({
  name: 'quizzes',
  initialState: { list: [], results: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchQuizzes.fulfilled, (s,a)=>{ s.list = a.payload; });
  }
});

export default slice.reducer;
