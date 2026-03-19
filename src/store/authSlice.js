import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../api/api';
import { showLoading, hideLoading } from './loadingSlice';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoading());
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      const profile = await api.getOwnProfile();
      toast.success('Login berhasil!');
      return profile.user;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err.message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoading());
      await api.register(name, email, password);
      toast.success('Registrasi berhasil! Silakan login.');
      return true;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err.message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoading());
      const data = await api.getOwnProfile();
      return data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.user = null;
        state.status = 'idle';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
