import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--espresso)',
      color: 'var(--cream)',
      padding: '60px 0 32px',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, marginBottom: '12px', color: 'var(--blush)' }}>
              Cloudy Clutches
            </h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, lineHeight: 1.7, color: 'var(--gold-light)' }}>
              Luxury that fits your budget
            </p>
            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '8px' }}>
              ✉ Orders via DM &nbsp;|&nbsp; 🚚 Ships Everywhere
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px', fontWeight: 500 }}>
              Shop
            </h4>
            {[
              { label: 'Hair Accessories', path: '/hair-accessories' },
              { label: 'Customised Hampers', path: '/hampers' },
              { label: 'Bouquets', path: '/bouquets' },
              { label: 'All Products', path: '/products' },
            ].map(item => (
              <Link key={item.path} to={item.path} style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', opacity: 0.7, transition: 'opacity 0.2s' }}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Account */}
          <div>
            <h4 style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px', fontWeight: 500 }}>
              Account
            </h4>
            {[
              { label: 'My Dashboard', path: '/dashboard' },
              { label: 'Order History', path: '/dashboard' },
              { label: 'Track Orders', path: '/dashboard' },
            ].map(item => (
              <Link key={item.path} to={item.path} style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', opacity: 0.7 }}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Info */}
          <div>
            <h4 style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px', fontWeight: 500 }}>
              Info
            </h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '8px' }}>📍 Ships All Over India</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '8px' }}>💬 Orders via DM only</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>💳 UPI Payment accepted</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '0.78rem', opacity: 0.5 }}>© 2024 Cloudy Clutches. All rights reserved.</p>
          <p style={{ fontSize: '0.78rem', opacity: 0.5 }}>Made by <span style={{ color: 'var(--gold)', opacity: 1 }}>WebWorks Private Limited</span></p>
        </div>
      </div>
    </footer>
  );
}
