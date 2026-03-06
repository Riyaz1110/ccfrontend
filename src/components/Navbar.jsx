import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(250, 247, 242, 0.96)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--cloud)',
      height: '80px', display: 'flex', alignItems: 'center'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              fontWeight: 400,
              color: 'var(--espresso)',
              letterSpacing: '-0.01em'
            }}>Cloudy Clutches</span>
            <span style={{
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              fontWeight: 500
            }}>Luxury that fits your budget</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          {[
            { label: 'Home', path: '/' },
            { label: 'Hair Accessories', path: '/hair-accessories' },
            { label: 'Hampers', path: '/hampers' },
            { label: 'Bouquets', path: '/bouquets' },
          ].map(item => (
            <Link key={item.path} to={item.path} style={{
              padding: '8px 14px',
              fontSize: '0.78rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              color: isActive(item.path) ? 'var(--rose)' : 'var(--chocolate)',
              borderBottom: isActive(item.path) ? '2px solid var(--rose)' : '2px solid transparent',
              transition: 'var(--transition)',
              textDecoration: 'none'
            }}>{item.label}</Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Cart */}
          {!isAdmin && (
            <Link to="/cart" style={{ position: 'relative', color: 'var(--espresso)' }}>
              <span style={{ fontSize: '1.3rem' }}>🛍️</span>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-8px',
                  background: 'var(--rose)', color: 'white',
                  borderRadius: '50%', width: '18px', height: '18px',
                  fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600
                }}>{cartCount}</span>
              )}
            </Link>
          )}

          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 14px',
                border: '1.5px solid var(--cloud)',
                borderRadius: '100px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: 'var(--espresso)'
              }}>
                {user.avatar && <img src={user.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />}
                <span>{isAdmin ? 'Admin' : user.name?.split(' ')[0]}</span>
                <span style={{ fontSize: '0.6rem' }}>▼</span>
              </button>
              {menuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '110%',
                  background: 'white', borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  minWidth: '180px', overflow: 'hidden', zIndex: 100,
                  border: '1px solid var(--cloud)'
                }}>
                  {isAdmin ? (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '12px 20px', fontSize: '0.85rem', color: 'var(--espresso)', borderBottom: '1px solid var(--cloud)' }}>
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '12px 20px', fontSize: '0.85rem', color: 'var(--espresso)', borderBottom: '1px solid var(--cloud)' }}>
                      My Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 20px', fontSize: '0.85rem', color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 22px', fontSize: '0.75rem' }}>
              Login
            </Link>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none' }} className="hamburger">☰</button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; font-size: 1.4rem; color: var(--espresso); }
        }
      `}</style>
    </nav>
  );
}
