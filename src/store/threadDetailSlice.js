import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';
import { showLoading, hideLoading } from './loadingSlice';

export const fetchThreadDetail = createAsyncThunk(
  'threadDetail/fetch',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoading());
      const data = await api.getThreadDetail(id);
      return data.detailThread;
    } catch (err) {
      return rejectWithValue(err.message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const createComment = createAsyncThunk(
  'threadDetail/createComment',
  async ({ threadId, content }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoading());
      const data = await api.createComment(threadId, content);
      return data.comment;
    } catch (err) {
      return rejectWithValue(err.message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const voteComment = createAsyncThunk(
  'threadDetail/voteComment',
  async ({
    threadId, commentId, voteType, userId,
  }, { rejectWithValue }) => {
    try {
      if (voteType === 1) await api.upVoteComment(threadId, commentId);
      else if (voteType === -1) await api.downVoteComment(threadId, commentId);
      else await api.neutralVoteComment(threadId, commentId);
      return { commentId, voteType, userId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const voteThreadDetail = createAsyncThunk(
  'threadDetail/vote',
  async ({ threadId, voteType, userId }, { rejectWithValue }) => {
    try {
      if (voteType === 1) await api.upVoteThread(threadId);
      else if (voteType === -1) await api.downVoteThread(threadId);
      else await api.neutralVoteThread(threadId);
      return { voteType, userId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const applyVote = (arr, userId, voteType) => {
  const up = arr.upVotesBy.filter((id) => id !== userId);
  const down = arr.downVotesBy.filter((id) => id !== userId);
  if (voteType === 1) up.push(userId);
  else if (voteType === -1) down.push(userId);
  return { upVotesBy: up, downVotesBy: down };
};

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    thread: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    optimisticVoteThread: (state, action) => {
      if (!state.thread) return;
      const { userId, voteType } = action.payload;
      const { upVotesBy, downVotesBy } = applyVote(state.thread, userId, voteType);
      state.thread.upVotesBy = upVotesBy;
      state.thread.downVotesBy = downVotesBy;
    },
    optimisticVoteComment: (state, action) => {
      if (!state.thread) return;
      const { commentId, userId, voteType } = action.payload;
      const comment = state.thread.comments.find((c) => c.id === commentId);
      if (!comment) return;
      const { upVotesBy, downVotesBy } = applyVote(comment, userId, voteType);
      comment.upVotesBy = upVotesBy;
      comment.downVotesBy = downVotesBy;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadDetail.pending, (state) => {
        state.status = 'loading';
        state.thread = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.thread = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(createComment.fulfilled, (state, action) => {
        if (state.thread) {
          state.thread.comments.push(action.payload);
        }
      });
  },
});

export const { optimisticVoteThread, optimisticVoteComment } = threadDetailSlice.actions;
export default threadDetailSlice.reducer;
