import React, { useState } from 'react';
import { registerCustomer } from '../api';

interface RegisterProps {
  onNavigate: (page: string) => void;
}

export default function Register({ onNavigate }: RegisterProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    address: '',
    drivingLicenseNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerCustomer(formData);
      setSuccess(true);
      setTimeout(() => {
        onNavigate('login');
      }, 2000);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center section animate-fade-up" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="card card-glass animate-scale-in" style={{ width: '100%', maxWidth: '520px', padding: '2.5rem' }}>
        <h2 className="text-center" style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>Create Account</h2>
        <p className="text-center" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Join DriveEasy and rent premium vehicles instantly
        </p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-col gap-md">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                className="form-input"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                className="form-input"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="form-input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                required
                pattern="^[0-9]{10}$"
                placeholder="10-digit number"
                className="form-input"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">License Number</label>
              <input
                type="text"
                name="drivingLicenseNumber"
                required
                placeholder="DL-XXXXXXX"
                className="form-input"
                value={formData.drivingLicenseNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              required
              placeholder="Your physical address"
              className="form-input"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading || success} className="btn btn-primary btn-lg btn-full" style={{ marginTop: '1rem' }}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <hr className="divider" />

        <p className="text-center" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary-light)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0
            }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
