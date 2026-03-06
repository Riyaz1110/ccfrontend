import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import QRCode from 'qrcode';

const UPI_ID = 'nishu01suba-2@okhdfcbank';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: shipping, 2: payment, 3: confirm
  const [shippingAddress, setShippingAddress] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef();

  useEffect(() => {
    if (!user) navigate('/login');
    if (cart.length === 0) navigate('/cart');
  }, [user, cart]);

  useEffect(() => {
    if (step === 2) generateQR();
  }, [step]);

  const generateQR = async () => {
    try {
      const upiString = `upi://pay?pa=${UPI_ID}&pn=CloudyClutches&am=${cartTotal.toFixed(2)}&cu=INR&tn=Order Payment`;
      const url = await QRCode.toDataURL(upiString, {
        width: 280, margin: 2,
        color: { dark: '#261A17', light: '#FAF7F2' }
      });
      setQrDataUrl(url);
    } catch (err) { console.error('QR generation error:', err); }
  };

  const handlePlaceOrder = async () => {
    if (!transactionId.trim()) { setError('Please enter the transaction ID'); return; }
    setLoading(true); setError('');
    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: cartTotal,
        transaction_id: transactionId.trim(),
        shipping_address: shippingAddress
      };
      await api.post('/api/orders', orderData);
      clearCart();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ width: '80px', height: '80px', background: '#d4edda', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 24px' }}>✓</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 400, marginBottom: '12px', color: 'var(--espresso)' }}>Order Placed!</h2>
          <p style={{ color: 'var(--mink)', marginBottom: '8px', lineHeight: 1.7 }}>
            Thank you for your order! We've received your payment and will confirm shortly via DM.
          </p>
          <p style={{ color: 'var(--mink)', fontSize: '0.85rem', marginBottom: '32px' }}>
            Transaction ID: <strong>{transactionId}</strong>
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>View Orders</button>
            <button className="btn-secondary" onClick={() => navigate('/products')}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px', maxWidth: '960px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 400, marginBottom: '8px' }}>Checkout</h1>

        {/* Steps */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '40px' }}>
          {['Shipping', 'Payment'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {i > 0 && <div style={{ width: '40px', height: '1px', background: step > i ? 'var(--rose)' : 'var(--cloud)' }} />}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                color: step >= i + 1 ? 'var(--rose)' : 'var(--mink)'
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: step >= i + 1 ? 'var(--rose)' : 'var(--cloud)',
                  color: step >= i + 1 ? 'white' : 'var(--mink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 600
                }}>{i + 1}</div>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{s}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }}>
          {/* Main */}
          <div>
            {step === 1 && (
              <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: '0 2px 12px var(--shadow)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '24px', fontWeight: 500 }}>Shipping Details</h3>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" value={user?.name || ''} readOnly className="form-input" style={{ background: '#f9f9f9' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" value={user?.email || ''} readOnly className="form-input" style={{ background: '#f9f9f9' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Shipping Address *</label>
                  <textarea
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    className="form-input"
                    rows={4}
                    placeholder="Enter your full shipping address including PIN code"
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button
                  className="btn-primary"
                  onClick={() => { if (!shippingAddress.trim()) { setError('Please enter shipping address'); return; } setError(''); setStep(2); }}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                >
                  Continue to Payment →
                </button>
                {error && <p style={{ color: '#c0392b', marginTop: '12px', fontSize: '0.85rem' }}>{error}</p>}
              </div>
            )}

            {step === 2 && (
              <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: '0 2px 12px var(--shadow)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '8px', fontWeight: 500 }}>UPI Payment</h3>
                <p style={{ color: 'var(--mink)', fontSize: '0.85rem', marginBottom: '28px' }}>
                  Scan the QR code with any UPI app to pay ₹{cartTotal.toLocaleString('en-IN')}
                </p>

                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  {qrDataUrl ? (
                    <div style={{ display: 'inline-block', padding: '16px', background: 'var(--cream)', borderRadius: '12px', border: '2px dashed var(--blush)' }}>
                      <img src={qrDataUrl} alt="UPI QR Code" style={{ width: '240px', height: '240px' }} />
                      <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--mink)', fontWeight: 500 }}>
                        UPI ID: <strong style={{ color: 'var(--espresso)' }}>{UPI_ID}</strong>
                      </p>
                      <p style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--rose-dark)', fontWeight: 600, marginTop: '4px' }}>
                        ₹{cartTotal.toLocaleString('en-IN')}
                      </p>
                    </div>
                  ) : <div className="spinner" />}
                </div>

                <div style={{ padding: '16px', background: '#fff3cd', borderRadius: '8px', marginBottom: '24px', fontSize: '0.82rem', color: '#856404' }}>
                  ⚠️ After payment, please note your Transaction/Reference ID from your UPI app
                </div>

                <div className="form-group">
                  <label className="form-label">Transaction ID / UTR Number *</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    className="form-input"
                    placeholder="Enter UTR/Transaction ID after payment"
                  />
                </div>

                {error && <p style={{ color: '#c0392b', marginBottom: '12px', fontSize: '0.85rem' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn-secondary" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
                  <button className="btn-primary" onClick={handlePlaceOrder} disabled={loading} style={{ flex: 2, justifyContent: 'center', padding: '14px' }}>
                    {loading ? 'Placing Order...' : '✓ Confirm Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: '0 2px 12px var(--shadow)', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '16px', fontWeight: 500 }}>Your Order</h3>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '10px', gap: '8px' }}>
                <span style={{ color: 'var(--mink)' }}>{item.name} × {item.quantity}</span>
                <span style={{ whiteSpace: 'nowrap' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div style={{ borderTop: '2px solid var(--cloud)', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600 }}>
              <span>Total</span>
              <span style={{ color: 'var(--rose-dark)' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="320px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
