import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/products').then(res => {
      setFeaturedProducts(res.data.slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = [
    { name: 'Hair Accessories', path: '/hair-accessories', emoji: '💝', desc: 'Clips, pins, bands & more', bg: '#f5e6e0' },
    { name: 'Customised Hampers', path: '/hampers', emoji: '🎁', desc: 'Curated gift bundles', bg: '#f5f0e0' },
    { name: 'Bouquets', path: '/bouquets', emoji: '💐', desc: 'Fresh & dried arrangements', bg: '#e8f0e8' },
  ];

  return (
    <div className="page-wrapper" style={{ paddingTop: 0 }}>
      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #faf0eb 0%, var(--cream) 40%, #f0ede8 100%)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(193,126,116,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-8%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
          <div style={{ maxWidth: '600px' }}>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px', fontWeight: 500 }}>
              ✦ Welcome to Cloudy Clutches
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              color: 'var(--espresso)',
              marginBottom: '24px'
            }}>
              Luxury that<br />
              <em style={{ color: 'var(--rose)', fontStyle: 'italic' }}>fits your</em><br />
              budget
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--mink)', lineHeight: 1.7, marginBottom: '40px', fontWeight: 300 }}>
              Discover handcrafted hair accessories, curated hampers, and stunning bouquets — all beautifully affordable.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => navigate('/products')}>
                Shop Now
              </button>
              <Link to="/hair-accessories" className="btn-secondary">
                Explore Collections
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '40px', marginTop: '48px' }}>
              {[['100+', 'Products'], ['Free', 'Shipping*'], ['UPI', 'Payment']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, color: 'var(--espresso)' }}>{val}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--mink)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>Our Collections</p>
            <h2 className="section-title">Shop by Category</h2>
            <div className="divider" style={{ margin: '16px auto' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {categories.map(cat => (
              <Link key={cat.name} to={cat.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: cat.bg,
                  borderRadius: '16px',
                  padding: '40px 32px',
                  textAlign: 'center',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{cat.emoji}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 500, color: 'var(--espresso)', marginBottom: '8px' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--mink)' }}>{cat.desc}</p>
                  <div style={{ marginTop: '20px', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--rose)' }}>
                    Shop Now →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>Handpicked</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link to="/products" className="btn-secondary">View All</Link>
          </div>
          {loading ? <div className="spinner" /> : (
            <div className="products-grid">
              {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Shipping Banner */}
      <section style={{ background: 'var(--espresso)', padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: 'var(--cream)', marginBottom: '16px', fontWeight: 300 }}>
            🚚 We ship <em style={{ color: 'var(--blush)' }}>all over India</em> — orders via DM
          </p>
          <p style={{ color: 'rgba(250,247,242,0.7)', marginBottom: '28px', fontSize: '0.95rem' }}>
            Place your order, make a UPI payment, and we'll handle the rest!
          </p>
          <button className="btn-rose" onClick={() => navigate('/products')}>Start Shopping</button>
        </div>
      </section>
    </div>
  );
}
