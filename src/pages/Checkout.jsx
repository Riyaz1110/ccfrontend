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
  const [step, setStep] = useState(1); // 1: shipping, 2: payment, 3: success
  const [shippingAddress, setShippingAddress] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);
  const fileInputRef = useRef();

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
        width: 260,
        margin: 2,
        color: { dark: '#261A17', light: '#FAF7F2' }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('QR error:', err);
    }
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Screenshot must be less than 5MB');
      return;
    }
    setScreenshot(file);
    setError('');
    const reader = new FileReader();
    reader.onload = (ev) => setScreenshotPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handlePlaceOrder = async () => {
    if (!transactionId.trim()) {
      setError('Please enter your Transaction ID / UTR number');
      return;
    }
    if (!screenshot) {
      setError('Please upload your payment screenshot');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('items', JSON.stringify(cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))));
      formData.append('total_amount', cartTotal);
      formData.append('transaction_id', transactionId.trim());
      formData.append('shipping_address', shippingAddress);
      formData.append('payment_screenshot', screenshot);

      const res = await api.post('/api/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setOrderId(res.data.id);
      clearCart();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 3: Success ────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ width: '90px', height: '90px', background: '#d4edda', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 28px' }}>
            ✓
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 400, marginBottom: '12px' }}>
            Order Placed! 🎉
          </h2>
          <p style={{ color: 'var(--mink)', lineHeight: 1.7, marginBottom: '8px' }}>
            Thank you! We've received your order and payment screenshot.
            We'll verify and confirm your order shortly via DM.
          </p>
          <p style={{ color: 'var(--mink)', fontSize: '0.85rem', marginBottom: '32px' }}>
            Transaction ID: <strong>{transactionId}</strong>
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>View My Orders</button>
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

        {/* Step Indicators */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '40px' }}>
          {['Shipping', 'Payment'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {i > 0 && <div style={{ width: '40px', height: '1px', background: step > i ? 'var(--rose)' : 'var(--cloud)' }} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step >= i + 1 ? 'var(--rose)' : 'var(--mink)' }}>
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

          {/* ─── Step 1: Shipping ─── */}
          {step === 1 && (
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: '0 2px 12px var(--shadow)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '24px', fontWeight: 500 }}>
                📦 Shipping Details
              </h3>
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
                  placeholder="Full address with city, state and PIN code"
                  style={{ resize: 'vertical' }}
                />
              </div>
              {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>}
              <button
                className="btn-primary"
                onClick={() => {
                  if (!shippingAddress.trim()) { setError('Please enter shipping address'); return; }
                  setError(''); setStep(2);
                }}
                style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* ─── Step 2: Payment ─── */}
          {step === 2 && (
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: '0 2px 12px var(--shadow)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '8px', fontWeight: 500 }}>
                💳 UPI Payment
              </h3>
              <p style={{ color: 'var(--mink)', fontSize: '0.85rem', marginBottom: '28px' }}>
                Scan the QR code with any UPI app to pay
              </p>

              {/* QR Code */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                {qrDataUrl ? (
                  <div style={{ display: 'inline-block', padding: '16px', background: 'var(--cream)', borderRadius: '12px', border: '2px dashed var(--blush)' }}>
                    <img src={qrDataUrl} alt="UPI QR Code" style={{ width: '220px', height: '220px' }} />
                    <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--mink)', fontWeight: 500 }}>
                      UPI ID: <strong style={{ color: 'var(--espresso)' }}>{UPI_ID}</strong>
                    </p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--rose-dark)', fontWeight: 600, marginTop: '4px' }}>
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </p>
                  </div>
                ) : <div className="spinner" />}
              </div>

              {/* Instructions */}
              <div style={{ background: '#f0f7ff', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a56db', marginBottom: '8px' }}>
                  📱 How to pay:
                </p>
                {[
                  '1. Scan QR with PhonePe / GPay / Paytm / any UPI app',
                  '2. Pay the exact amount shown',
                  '3. Note the Transaction ID / UTR from your app',
                  '4. Take a screenshot of the payment confirmation',
                  '5. Enter details below and upload screenshot',
                ].map(step => (
                  <p key={step} style={{ fontSize: '0.78rem', color: '#374151', marginBottom: '4px' }}>{step}</p>
                ))}
              </div>

              {/* Transaction ID */}
              <div className="form-group">
                <label className="form-label">Transaction ID / UTR Number *</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  className="form-input"
                  placeholder="e.g. 424212345678"
                />
              </div>

              {/* Screenshot Upload */}
              <div className="form-group">
                <label className="form-label">Payment Screenshot *</label>
                <div
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    border: `2px dashed ${screenshotPreview ? 'var(--rose)' : 'var(--cloud)'}`,
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: screenshotPreview ? 'rgba(193,126,116,0.04)' : 'var(--cream)',
                    transition: 'all 0.2s'
                  }}
                >
                  {screenshotPreview ? (
                    <div>
                      <img
                        src={screenshotPreview}
                        alt="Payment screenshot"
                        style={{ maxHeight: '200px', borderRadius: '8px', objectFit: 'contain', marginBottom: '8px' }}
                      />
                      <p style={{ fontSize: '0.75rem', color: 'var(--rose)', fontWeight: 500 }}>
                        ✓ Screenshot uploaded — click to change
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📸</div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--espresso)', fontWeight: 500, marginBottom: '4px' }}>
                        Upload Payment Screenshot
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--mink)' }}>
                        Click to select — JPG, PNG up to 5MB
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotChange}
                  style={{ display: 'none' }}
                />
              </div>

              {error && (
                <div style={{ background: '#fff0f0', border: '1px solid #fcc', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#c0392b', fontSize: '0.82rem' }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>
                  ← Back
                </button>
                <button
                  className="btn-primary"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  style={{ flex: 2, justifyContent: 'center', padding: '14px' }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                      Placing Order...
                    </span>
                  ) : '✓ Confirm Order'}
                </button>
              </div>
            </div>
          )}

          {/* Order Summary Sidebar */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: '0 2px 12px var(--shadow)', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '16px', fontWeight: 500 }}>Your Order</h3>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '10px', gap: '8px' }}>
                <span style={{ color: 'var(--mink)' }}>{item.name} × {item.quantity}</span>
                <span style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--cloud)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--mink)', marginBottom: '8px' }}>
              <span>Shipping</span>
              <span style={{ color: '#22c55e', fontWeight: 500 }}>Free</span>
            </div>
            <div style={{ borderTop: '2px solid var(--cloud)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600 }}>
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
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}