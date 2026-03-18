/**
 * Skenario pengujian LoginPage component:
 * - harus menampilkan form login dengan input email dan password
 * - harus menampilkan error ketika login gagal
 */

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '../pages/LoginPage';
import authReducer from '../store/authSlice';
import loadingReducer from '../store/loadingSlice';

const createStore = (authState = {}) => configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
  },
  preloadedState: {
    auth: {
      user: null, status: 'idle', error: null, ...authState,
    },
  },
});

const renderLoginPage = (authState) => render(
  <Provider store={createStore(authState)}>
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  </Provider>,
);

describe('LoginPage component', () => {
  it('harus menampilkan input email dan password', () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('harus menampilkan tombol login', () => {
    renderLoginPage();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('harus menampilkan pesan error ketika login gagal', () => {
    renderLoginPage({ error: 'Email atau password salah' });
    expect(screen.getByText('Email atau password salah')).toBeInTheDocument();
  });
});
