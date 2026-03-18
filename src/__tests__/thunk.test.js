/**
 * Skenario pengujian thunk functions:
 * - fetchThreads harus dispatch fulfilled ketika API berhasil
 * - fetchThreads harus dispatch rejected ketika API gagal
 * - fetchLeaderboard harus dispatch fulfilled ketika API berhasil
 * - fetchLeaderboard harus dispatch rejected ketika API gagal
 */

import { configureStore } from '@reduxjs/toolkit';
import threadReducer, { fetchThreads } from '../store/threadSlice';
import leaderboardReducer, { fetchLeaderboard } from '../store/leaderboardSlice';
import loadingReducer from '../store/loadingSlice';
import api from '../api/api';

jest.mock('../api/api', () => {
  const mockGetThreads = jest.fn();
  const mockGetUsers = jest.fn();
  const mockGetLeaderboard = jest.fn();

  return {
    __esModule: true,
    default: {
      getThreads: mockGetThreads,
      getUsers: mockGetUsers,
      getLeaderboard: mockGetLeaderboard,
    },
  };
});

const createStore = () => configureStore({
  reducer: {
    threads: threadReducer,
    leaderboard: leaderboardReducer,
    loading: loadingReducer,
  },
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fetchThreads thunk', () => {
  it('harus dispatch fulfilled ketika API berhasil', async () => {
    api.getThreads.mockResolvedValue({ threads: [{ id: 'thread-1', ownerId: 'user-1' }] });
    api.getUsers.mockResolvedValue({ users: [{ id: 'user-1', name: 'User 1' }] });

    const store = createStore();
    await store.dispatch(fetchThreads());

    const { threads } = store.getState();
    expect(threads.status).toBe('succeeded');
    expect(threads.items).toHaveLength(1);
  });

  it('harus dispatch rejected ketika API gagal', async () => {
    api.getThreads.mockRejectedValue(new Error('Network Error'));

    const store = createStore();
    await store.dispatch(fetchThreads());

    const { threads } = store.getState();
    expect(threads.status).toBe('failed');
  });
});

describe('fetchLeaderboard thunk', () => {
  it('harus dispatch fulfilled ketika API berhasil', async () => {
    api.getLeaderboard.mockResolvedValue({ leaderboards: [{ user: { id: 'user-1' }, score: 10 }] });

    const store = createStore();
    await store.dispatch(fetchLeaderboard());

    const { leaderboard } = store.getState();
    expect(leaderboard.status).toBe('succeeded');
    expect(leaderboard.items).toHaveLength(1);
  });

  it('harus dispatch rejected ketika API gagal', async () => {
    api.getLeaderboard.mockRejectedValue(new Error('Network Error'));

    const store = createStore();
    await store.dispatch(fetchLeaderboard());

    const { leaderboard } = store.getState();
    expect(leaderboard.status).toBe('failed');
  });
});
