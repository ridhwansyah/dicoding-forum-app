import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';
import { showLoading, hideLoading } from './loadingSlice';

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetch',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoading());
      const data = await api.getLeaderboard();
      return data.leaderboards;
    } catch (err) {
      return rejectWithValue(err.message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export default leaderboardSlice.reducer;
