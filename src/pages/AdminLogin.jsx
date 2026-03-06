import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/api/auth/admin/login', { email, password });
      loginAdmin(res.data.admin, res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--espresso)' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '48px 40px', maxWidth: '400px', width: '90%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--espresso)', marginBottom: '6px' }}>Admin Portal</h1>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>Cloudy Clutches</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="admin@123" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required />
          </div>
          {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: 'var(--mink)' }}>
          <a href="/" style={{ color: 'var(--rose)' }}>← Back to Shop</a>
        </p>
      </div>
    </div>
  );
}
