import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL ?? 'http://localhost:5000';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(
        `${API}/api/register`,
        { fullName, email, password },
        { withCredentials: true }
      );
      setSuccess('Registration successful. You can now log in.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err: any) {
      const message =
        (err && err.response && err.response.data && err.response.data.error) ||
        'Registration failed';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} noValidate data-testid="register-form">
        <label>
          Full name
          <input
            type="text"
            name="fullName"
            data-testid="register-fullName"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </label>
        <label>
          Email
          <input
            type="text"
            name="email"
            data-testid="register-email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            data-testid="register-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <label>
          Confirm password
          <input
            type="password"
            name="confirmPassword"
            data-testid="register-confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </label>
        {error && (
          <div className="error" data-testid="register-error" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="success" data-testid="register-success" role="status">
            {success}
          </div>
        )}
        <button type="submit" data-testid="register-submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Create account'}
        </button>
      </form>
      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
