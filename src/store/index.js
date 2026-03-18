import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import threadReducer from './threadSlice';
import threadDetailReducer from './threadDetailSlice';
import leaderboardReducer from './leaderboardSlice';
import loadingReducer from './loadingSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadReducer,
    threadDetail: threadDetailReducer,
    leaderboard: leaderboardReducer,
    loading: loadingReducer,
  },
});

export default store;
