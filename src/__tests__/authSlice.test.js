/**
 * Skenario pengujian authSlice reducer:
 * - harus mengembalikan state awal
 * - harus mengisi user ketika login fulfilled
 * - harus menghapus user ketika logout dipanggil
 * - harus mengisi error ketika login rejected
 */

import authReducer, { logout } from '../store/authSlice';

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

const fakeUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@test.com',
};

describe('authSlice reducer', () => {
  it('harus mengembalikan state awal', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state.user).toBeNull();
    expect(state.status).toBe('idle');
  });

  it('harus mengisi user ketika loginUser fulfilled', () => {
    const state = authReducer(initialState, {
      type: 'auth/login/fulfilled',
      payload: fakeUser,
    });
    expect(state.user).toEqual(fakeUser);
    expect(state.status).toBe('succeeded');
  });

  it('harus menghapus user ketika logout dipanggil', () => {
    const state = authReducer(
      { ...initialState, user: fakeUser },
      logout(),
    );
    expect(state.user).toBeNull();
  });

  it('harus mengisi error ketika loginUser rejected', () => {
    const state = authReducer(initialState, {
      type: 'auth/login/rejected',
      payload: 'Email atau password salah',
    });
    expect(state.error).toBe('Email atau password salah');
  });
});
