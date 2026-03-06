import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const statusClass = {
  'Pending': 'status-pending',
  'Confirmed': 'status-confirmed',
  'Shipped': 'status-shipped',
  'Delivered': 'status-delivered'
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
    else fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/user/orders');
      setOrders(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const statusSteps = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user?.avatar && <img src={user.avatar} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--blush)' }} />}
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--espresso)' }}>
                Hello, {user?.name?.split(' ')[0]}!
              </h1>
              <p style={{ color: 'var(--mink)', fontSize: '0.85rem' }}>{user?.email}</p>
            </div>
          </div>
          <button className="btn-secondary" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Total Orders', value: orders.length, icon: '📦' },
            { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, icon: '✅' },
            { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, icon: '⏳' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px var(--shadow)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'var(--espresso)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--mink)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '24px', fontWeight: 400 }}>Order History</h2>

        {loading ? <div className="spinner" /> : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <div className="empty-state-title">No orders yet</div>
            <div className="empty-state-text" style={{ marginBottom: '24px' }}>Start shopping to see your orders here</div>
            <button className="btn-primary" onClick={() => navigate('/products')}>Shop Now</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px var(--shadow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--mink)', marginBottom: '4px' }}>Order #{order.id}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--mink)' }}>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--rose-dark)', marginBottom: '6px' }}>
                      ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
                    </div>
                    <span className={statusClass[order.status] || 'status-pending'}>{order.status}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    {statusSteps.map((s, i) => {
                      const currentIdx = statusSteps.indexOf(order.status);
                      return (
                        <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= currentIdx ? 'var(--rose)' : 'var(--cloud)' }} />
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {statusSteps.map(s => (
                      <span key={s} style={{ fontSize: '0.65rem', color: order.status === s ? 'var(--rose)' : 'var(--mink)', fontWeight: order.status === s ? 600 : 300 }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* Order Items */}
                {order.items?.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--cloud)', paddingTop: '12px' }}>
                    {order.items.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px', color: 'var(--mink)' }}>
                        <span>{item.product_name} × {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}

                {order.transaction_id && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--mink)', marginTop: '8px' }}>
                    Transaction ID: <strong>{order.transaction_id}</strong>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
