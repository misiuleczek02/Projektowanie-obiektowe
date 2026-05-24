import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    try {
      setSubmitting(true);
      await login(email, password);
      navigate('/account');
    } catch (err: any) {
      setError((err.response && err.response.data && err.response.data.error) || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit} noValidate data-testid="login-form">
        <label>
          Email
          <input
            type="text"
            data-testid="login-email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            data-testid="login-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <div className="error" data-testid="login-error" role="alert">
            {error}
          </div>
        )}
        <button type="submit" data-testid="login-submit" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p style={{ marginTop: 12 }}>
        Need an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
