import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../store/authSlice';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (result.meta.requestStatus === 'fulfilled') navigate('/');
  };

  return (
    <main className="page page--auth">
      <div className="auth-card">
        <h2 className="auth-card__title">Login</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="create-form__input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="create-form__input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-primary btn-primary--full">Login</button>
        </form>
        <p className="auth-card__footer">
          Belum punya akun? <Link to="/register">Daftar di sini.</Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;