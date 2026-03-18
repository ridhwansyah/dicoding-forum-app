/**
 * Skenario pengujian threadSlice reducer:
 * - harus mengembalikan state awal
 * - harus mengubah activeCategory ketika setCategory dipanggil
 * - harus menerapkan optimistic vote upvote pada thread
 * - harus menerapkan optimistic vote downvote pada thread
 */

import threadReducer, { setCategory, optimisticVote } from '../store/threadSlice';

const initialState = {
  items: [],
  activeCategory: '',
  status: 'idle',
  error: null,
};

const fakeThread = {
  id: 'thread-1',
  title: 'Test Thread',
  upVotesBy: [],
  downVotesBy: [],
};

describe('threadSlice reducer', () => {
  it('harus mengembalikan state awal', () => {
    const state = threadReducer(undefined, { type: 'unknown' });
    expect(state.activeCategory).toBe('');
    expect(state.items).toEqual([]);
  });

  it('harus mengubah activeCategory ketika setCategory dipanggil', () => {
    const state = threadReducer(initialState, setCategory('redux'));
    expect(state.activeCategory).toBe('redux');
  });

  it('harus menambah userId ke upVotesBy ketika upvote', () => {
    const state = threadReducer(
      { ...initialState, items: [fakeThread] },
      optimisticVote({ threadId: 'thread-1', voteType: 1, userId: 'user-1' }),
    );
    expect(state.items[0].upVotesBy).toContain('user-1');
  });

  it('harus menambah userId ke downVotesBy ketika downvote', () => {
    const state = threadReducer(
      { ...initialState, items: [fakeThread] },
      optimisticVote({ threadId: 'thread-1', voteType: -1, userId: 'user-1' }),
    );
    expect(state.items[0].downVotesBy).toContain('user-1');
  });
});
