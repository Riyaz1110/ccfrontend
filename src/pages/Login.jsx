import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const { loginUser, user } = useAuth();
  const navigate = useNavigate();
  const googleRef = useRef(null);

  useEffect(() => {
    if (user) navigate('/');
  }, [user]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleResponse,
    });

    if (googleRef.current) {
      window.google.accounts.id.renderButton(googleRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: 300,
      });
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await api.post('/api/auth/google', { credential: response.credential });
      loginUser(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      console.error('Google login error:', err);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #faf0eb, var(--cream))' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '48px 40px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '420px', width: '90%' }}>
        {/* Logo */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '6px' }}>
            Cloudy Clutches
          </h1>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>
            Luxury that fits your budget
          </p>
        </div>

        <div style={{ width: '60px', height: '2px', background: 'var(--rose)', margin: '0 auto 32px' }} />

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, marginBottom: '8px', color: 'var(--espresso)' }}>
          Welcome Back
        </h2>
        <p style={{ color: 'var(--mink)', fontSize: '0.88rem', marginBottom: '32px', lineHeight: 1.6 }}>
          Sign in with your Google account to continue shopping
        </p>

        {/* Google Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
            <div ref={googleRef} />
          ) : (
            <div style={{ padding: '12px 24px', background: '#f1f3f4', borderRadius: '100px', fontSize: '0.85rem', color: '#666' }}>
              Google OAuth not configured
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--cloud)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--mink)' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--cloud)' }} />
        </div>

        {/* Admin login link */}
        <p style={{ fontSize: '0.8rem', color: 'var(--mink)' }}>
          Admin?{' '}
          <a href="/admin/login" style={{ color: 'var(--rose)', fontWeight: 500 }}>Login here</a>
        </p>

        {/* Benefits */}
        <div style={{ marginTop: '32px', padding: '20px', background: 'var(--cream)', borderRadius: '12px' }}>
          {[
            ['🛍️', 'Track your orders'],
            ['💝', 'Save your wishlist'],
            ['🔒', 'Secure checkout'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '0.82rem', color: 'var(--mink)' }}>
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
