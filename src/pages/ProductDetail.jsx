import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api.get(`/api/products/${id}`).then(res => {
      setProduct(res.data);
      setLoading(false);
    }).catch(() => { setLoading(false); navigate('/products'); });
  }, [id]);

  const handleAddToCart = () => {
    if (!user) { navigate('/login'); return; }
    addToCart(product, qty);
    showToast(`${product.name} added to cart!`);
  };

  if (loading) return <div className="page-wrapper"><div className="spinner" /></div>;
  if (!product) return null;

  const imgSrc = product.image ? `data:image/jpeg;base64,${product.image}` : null;

  const categoryBadge = {
    'Hair Accessories': 'badge-rose',
    'Hampers': 'badge-gold',
    'Bouquets': 'badge-sage'
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '40px', fontSize: '0.8rem', color: 'var(--mink)' }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
          <span>/</span>
          <span onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>Products</span>
          <span>/</span>
          <span style={{ color: 'var(--espresso)' }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
          {/* Image */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', background: 'var(--cloud)', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {imgSrc ? (
              <img src={imgSrc} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '5rem', opacity: 0.3 }}>
                {product.category === 'Bouquets' ? '💐' : product.category === 'Hampers' ? '🎁' : '💝'}
              </span>
            )}
          </div>

          {/* Details */}
          <div>
            <span className={`badge ${categoryBadge[product.category] || 'badge-rose'}`} style={{ marginBottom: '16px' }}>
              {product.category}
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 400, color: 'var(--espresso)', lineHeight: 1.2, marginBottom: '12px', marginTop: '12px' }}>
              {product.name}
            </h1>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--rose-dark)', fontWeight: 600, marginBottom: '24px' }}>
              ₹{parseFloat(product.price).toLocaleString('en-IN')}
            </div>

            <div className="divider" style={{ margin: '0 0 24px' }} />

            <p style={{ color: 'var(--mink)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '28px' }}>
              {product.description || 'A beautiful handcrafted product made with love and care.'}
            </p>

            {/* Stock info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '0.85rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: product.stock > 0 ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
              <span style={{ color: 'var(--mink)' }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--mink)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Qty:</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--cloud)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '8px 16px', fontSize: '1.1rem', background: 'none', cursor: 'pointer', color: 'var(--espresso)' }}>−</button>
                  <span style={{ padding: '8px 20px', borderLeft: '1.5px solid var(--cloud)', borderRight: '1.5px solid var(--cloud)', fontSize: '0.9rem', fontWeight: 500 }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ padding: '8px 16px', fontSize: '1.1rem', background: 'none', cursor: 'pointer', color: 'var(--espresso)' }}>+</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={handleAddToCart} disabled={product.stock === 0} style={{ flex: 1, justifyContent: 'center' }}>
                {product.stock === 0 ? 'Out of Stock' : '🛍️ Add to Cart'}
              </button>
              <button className="btn-secondary" onClick={() => navigate('/cart')} style={{ flex: 1, justifyContent: 'center' }}>
                View Cart
              </button>
            </div>

            {/* Features */}
            <div style={{ marginTop: '32px', padding: '20px', background: 'var(--warm-white)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {[['🚚', 'Ships All Over'], ['✨', 'Handcrafted']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--mink)' }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="grid"] { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </div>
  );
}
