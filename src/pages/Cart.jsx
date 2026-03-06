import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '12px' }}>Login to view your cart</h2>
          <p style={{ color: 'var(--mink)', marginBottom: '24px' }}>Please login to manage your shopping cart</p>
          <button className="btn-primary" onClick={() => navigate('/login')}>Login Now</button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <div className="empty-state">
            <div className="empty-state-icon">🛍️</div>
            <div className="empty-state-title">Your cart is empty</div>
            <div className="empty-state-text" style={{ marginBottom: '24px' }}>Add some beautiful items to your cart</div>
            <button className="btn-primary" onClick={() => navigate('/products')}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 400, marginBottom: '8px' }}>Shopping Cart</h1>
        <p style={{ color: 'var(--mink)', marginBottom: '40px' }}>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
          {/* Cart Items */}
          <div>
            {cart.map(item => {
              const imgSrc = item.image ? `data:image/jpeg;base64,${item.image}` : null;
              return (
                <div key={item.id} style={{
                  display: 'grid', gridTemplateColumns: '80px 1fr auto',
                  gap: '20px', alignItems: 'center',
                  padding: '20px', marginBottom: '12px',
                  background: 'white', borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 1px 8px var(--shadow)'
                }}>
                  {/* Image */}
                  <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: 'var(--cloud)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {imgSrc ? <img src={imgSrc} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1.8rem' }}>✨</span>}
                  </div>

                  {/* Info */}
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 500, marginBottom: '4px' }}>{item.name}</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--mink)', marginBottom: '12px' }}>{item.category}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--cloud)', borderRadius: '4px', overflow: 'hidden' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '4px 12px', background: 'none', cursor: 'pointer', fontSize: '1rem' }}>−</button>
                        <span style={{ padding: '4px 16px', borderLeft: '1px solid var(--cloud)', borderRight: '1px solid var(--cloud)', fontSize: '0.9rem' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '4px 12px', background: 'none', cursor: 'pointer', fontSize: '1rem' }}>+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ fontSize: '0.75rem', color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}>Remove</button>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--rose-dark)' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--mink)' }}>₹{parseFloat(item.price).toLocaleString('en-IN')} each</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: '0 2px 12px var(--shadow)', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '20px', fontWeight: 500 }}>Order Summary</h3>

            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--mink)' }}>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid var(--cloud)', margin: '16px 0 12px', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--mink)' }}>
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--mink)' }}>
                <span>Shipping</span>
                <span style={{ color: '#22c55e' }}>Free</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, marginBottom: '24px', paddingTop: '8px', borderTop: '2px solid var(--cloud)' }}>
              <span>Total</span>
              <span style={{ color: 'var(--rose-dark)' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>

            <button className="btn-primary" onClick={() => navigate('/checkout')} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              Proceed to Checkout
            </button>
            <button onClick={() => navigate('/products')} style={{ width: '100%', marginTop: '12px', padding: '10px', background: 'none', border: 'none', color: 'var(--mink)', fontSize: '0.8rem', cursor: 'pointer' }}>
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="360px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
