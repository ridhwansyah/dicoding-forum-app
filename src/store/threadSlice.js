import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';
import { showLoading, hideLoading } from './loadingSlice';

export const fetchThreads = createAsyncThunk(
  'threads/fetchAll',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoading());
      const [threadsData, usersData] = await Promise.all([api.getThreads(), api.getUsers()]);
      const usersMap = {};
      usersData.users.forEach((u) => {
        usersMap[u.id] = u;
      });
      return threadsData.threads.map((t) => ({
        ...t,
        owner: usersMap[t.ownerId] || { id: t.ownerId, name: 'Unknown', avatar: '' },
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const createThread = createAsyncThunk(
  'threads/create',
  async ({ title, body, category }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoading());
      const data = await api.createThread(title, body, category);
      return data.thread;
    } catch (err) {
      return rejectWithValue(err.message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const voteThread = createAsyncThunk(
  'threads/vote',
  async ({ threadId, voteType, userId }, { rejectWithValue }) => {
    try {
      if (voteType === 1) await api.upVoteThread(threadId);
      else if (voteType === -1) await api.downVoteThread(threadId);
      else await api.neutralVoteThread(threadId);
      return { threadId, voteType, userId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const threadSlice = createSlice({
  name: 'threads',
  initialState: {
    items: [],
    activeCategory: '',
    status: 'idle',
    error: null,
  },
  reducers: {
    setCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    optimisticVote: (state, action) => {
      const { threadId, voteType, userId } = action.payload;
      const thread = state.items.find((t) => t.id === threadId);
      if (!thread) return;
      thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      if (voteType === 1) thread.upVotesBy.push(userId);
      else if (voteType === -1) thread.downVotesBy.push(userId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const { setCategory, optimisticVote } = threadSlice.actions;
export default threadSlice.reducer;
