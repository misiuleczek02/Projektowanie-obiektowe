import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AccountState {
  email: string;
  fullName: string;
  address: string;
  notificationsEmail: string;
}

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Account: React.FC = () => {
  const { user, loading, refresh } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<AccountState | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/api/account`, { withCredentials: true });
        setData(res.data);
      } catch {
        setError('Failed to load account');
      }
    };
    if (user) load();
  }, [user]);

  const onChange = (field: keyof AccountState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data) return;
    setData({ ...data, [field]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setError(null);
    try {
      const res = await axios.post(
        `${API}/api/account/update`,
        {
          fullName: data.fullName,
          address: data.address,
          notificationsEmail: data.notificationsEmail
        },
        { withCredentials: true }
      );
      setData(res.data.user);
      setSavedAt(Date.now());
      refresh();
    } catch {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="container">
        <p data-testid="account-loading">Loading account...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Account settings</h1>
      <p>
        Logged in as <strong data-testid="account-email">{data.email}</strong>
      </p>
      <form onSubmit={onSubmit} data-testid="account-form">
        <label>
          Full name
          <input
            type="text"
            data-testid="account-fullName"
            value={data.fullName}
            onChange={onChange('fullName')}
          />
        </label>
        <label>
          Shipping address
          <input
            type="text"
            data-testid="account-address"
            value={data.address}
            onChange={onChange('address')}
          />
        </label>
        <label>
          Notifications email
          <input
            type="text"
            data-testid="account-notificationsEmail"
            value={data.notificationsEmail}
            onChange={onChange('notificationsEmail')}
          />
        </label>
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
        {savedAt && (
          <div className="success" data-testid="account-saved" role="status">
            Saved
          </div>
        )}
        <button type="submit" data-testid="account-submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
};

export default Account;
