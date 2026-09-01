import React, { useState } from 'react';
import { loginCustomer } from '../api';
import { useAuth } from '../AuthContext';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const { login } = useAuth();
  const [loginType, setLoginType] = useState<'USER' | 'ADMIN'>('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await loginCustomer(email, password);
      
      // Validate role permissions when Admin Login tab is active
      if (loginType === 'ADMIN' && response.role !== 'ADMIN') {
        throw new Error('Access Denied: You do not have Administrator privileges.');
      }

      login(response);

      if (response.role === 'ADMIN' || loginType === 'ADMIN') {
        onNavigate('admin');
      } else {
        onNavigate('fleet');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center section animate-fade-up" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="card card-glass animate-scale-in" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        
        {/* Login Type Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          marginBottom: '2rem'
        }}>
          <button
            type="button"
            onClick={() => {
              setLoginType('USER');
              setEmail('');
              setPassword('');
              setError('');
            }}
            style={{
              background: loginType === 'USER' ? 'var(--gradient-primary)' : 'transparent',
              color: loginType === 'USER' ? '#fff' : 'var(--color-text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.6rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            👤 Customer Login
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType('ADMIN');
              setEmail('admin@carrental.com');
              setPassword('admin123');
              setError('');
            }}
            style={{
              background: loginType === 'ADMIN' ? 'var(--gradient-accent)' : 'transparent',
              color: loginType === 'ADMIN' ? '#fff' : 'var(--color-text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.6rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            🛡️ Admin Login
          </button>
        </div>

        <h2 className="text-center" style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>
          {loginType === 'ADMIN' ? 'Admin Control Center' : 'Welcome Back'}
        </h2>
        <p className="text-center" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          {loginType === 'ADMIN'
            ? 'Sign in with administrator credentials to manage fleet & bookings'
            : 'Sign in to manage your car bookings'}
        </p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-col gap-lg">
          <div className="form-group">
            <label className="form-label">{loginType === 'ADMIN' ? 'Admin Email' : 'Email Address'}</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder={loginType === 'ADMIN' ? 'admin@carrental.com' : 'name@example.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn ${loginType === 'ADMIN' ? 'btn-accent' : 'btn-primary'} btn-lg btn-full`}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : loginType === 'ADMIN' ? 'Sign In as Admin' : 'Sign In as Customer'}
          </button>
        </form>

        {loginType === 'USER' && (
          <>
            <hr className="divider" />

            <p className="text-center" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary-light)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Create account
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
