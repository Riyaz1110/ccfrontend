import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [added, setAdded] = useState(false);

  const imgSrc = product.image ? `data:image/jpeg;base64,${product.image}` : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const categoryColor = {
    'Hair Accessories': 'badge-rose',
    'Hampers': 'badge-gold',
    'Bouquets': 'badge-sage'
  };

  return (
    <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
      {/* Image */}
      <div style={{ position: 'relative', paddingTop: '100%', background: 'var(--cloud)', overflow: 'hidden' }}>
        {imgSrc ? (
          <img src={imgSrc} alt={product.name} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }} />
        ) : (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem', opacity: 0.3
          }}>
            {product.category === 'Bouquets' ? '💐' : product.category === 'Hampers' ? '🎁' : '💝'}
          </div>
        )}
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <span className={`badge ${categoryColor[product.category] || 'badge-rose'}`}>{product.category}</span>
        </div>
        {product.stock <= 3 && product.stock > 0 && (
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <span style={{ background: '#fff3cd', color: '#856404', padding: '3px 8px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 600 }}>
              Only {product.stock} left
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 500, marginBottom: '4px', color: 'var(--espresso)', lineHeight: 1.3 }}>
          {product.name}
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--mink)', marginBottom: '12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--rose-dark)' }}>
            ₹{parseFloat(product.price).toLocaleString('en-IN')}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              padding: '8px 16px',
              background: added ? 'var(--sage)' : product.stock === 0 ? 'var(--cloud)' : 'var(--espresso)',
              color: product.stock === 0 ? 'var(--mink)' : 'var(--cream)',
              border: 'none', borderRadius: 'var(--radius)',
              fontSize: '0.72rem', fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {product.stock === 0 ? 'Sold Out' : added ? '✓ Added' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
