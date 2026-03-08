import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', category: 'Hair Accessories', price: '', stock: '', available: true });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (!isAdmin) navigate('/admin/login');
    else { fetchStats(); fetchProducts(); fetchOrders(); }
  }, [isAdmin]);

  const fetchStats = async () => {
    try { const res = await api.get('/api/admin/stats'); setStats(res.data); } catch {}
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products/admin/all');
      setProducts(res.data);
    } catch { setLoading(false); }
    setLoading(false);
  };

  const fetchOrders = async () => {
    try { const res = await api.get('/api/orders'); setOrders(res.data); } catch {}
  };

  const openAddForm = () => {
    setEditProduct(null);
    setFormData({ name: '', description: '', category: 'Hair Accessories', price: '', stock: '', available: true });
    setImageFile(null); setImagePreview('');
    setShowProductForm(true);
  };

  const openEditForm = (product) => {
    setEditProduct(product);
    setFormData({ name: product.name, description: product.description || '', category: product.category, price: product.price, stock: product.stock, available: product.available });
    setImagePreview(product.image ? `data:image/jpeg;base64,${product.image}` : '');
    setImageFile(null);
    setShowProductForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editProduct) {
        await api.put(`/api/products/${editProduct.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Product updated!');
      } else {
        await api.post('/api/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Product added!');
      }
      setShowProductForm(false);
      fetchProducts(); fetchStats();
    } catch (err) { showToast(err.response?.data?.error || 'Error saving product', 'error'); }
    setFormLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      showToast('Product deleted');
      fetchProducts(); fetchStats();
    } catch { showToast('Error deleting product', 'error'); }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status });
      showToast('Order status updated!');
      fetchOrders();
    } catch { showToast('Error updating status', 'error'); }
  };

  if (loading) return <div className="page-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper" style={{ background: '#f8f5f2' }}>
      {/* Sidebar + Main layout */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        {/* Sidebar */}
        <div style={{ width: '240px', background: 'var(--espresso)', color: 'var(--cream)', padding: '32px 0', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0 24px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--blush)', marginBottom: '4px' }}>Admin Panel</h2>
            <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Cloudy Clutches</p>
          </div>
          <nav style={{ padding: '24px 0', flex: 1 }}>
            {[
              { id: 'products', label: '📦 Products' },
              { id: 'orders', label: '🛒 Orders' },
            ].map(item => (
              <button key={item.id} onClick={() => setTab(item.id)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '12px 24px', fontSize: '0.85rem', fontWeight: 500,
                background: tab === item.id ? 'rgba(232,196,176,0.15)' : 'none',
                color: tab === item.id ? 'var(--blush)' : 'rgba(250,247,242,0.7)',
                border: 'none', borderLeft: tab === item.id ? '3px solid var(--blush)' : '3px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s'
              }}>{item.label}</button>
            ))}
          </nav>
          <div style={{ padding: '24px' }}>
            <button onClick={() => { logout(); navigate('/'); }} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.08)', color: 'rgba(250,247,242,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Total Products', value: stats.totalProducts || 0, icon: '📦', color: '#e8f4fd' },
              { label: 'Total Orders', value: stats.totalOrders || 0, icon: '🛒', color: '#fef3cd' },
              { label: 'Pending Orders', value: stats.pendingOrders || 0, icon: '⏳', color: '#fff0f0' },
              { label: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`, icon: '💰', color: '#f0fdf4' },
            ].map(s => (
              <div key={s.label} style={{ background: s.color, borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--espresso)' }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--mink)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Products Tab */}
          {tab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400 }}>Products</h2>
                <button className="btn-primary" onClick={openAddForm}>+ Add Product</button>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px var(--shadow)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--cream)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mink)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left' }}>Image</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left' }}>Category</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right' }}>Price</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center' }}>Stock</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center' }}>Available</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} style={{ borderTop: '1px solid var(--cloud)', fontSize: '0.85rem' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: 'var(--cloud)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {p.image ? <img src={`data:image/jpeg;base64,${p.image}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1.2rem' }}>✨</span>}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>{p.name}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--mink)' }}>{p.category}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>₹{parseFloat(p.price).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <span style={{ color: p.stock < 5 ? '#c0392b' : 'inherit', fontWeight: p.stock < 5 ? 700 : 400 }}>{p.stock}</span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <span style={{ color: p.available ? '#22c55e' : '#c0392b', fontWeight: 600, fontSize: '0.8rem' }}>
                            {p.available ? '✓ Yes' : '✕ No'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button onClick={() => openEditForm(p)} style={{ padding: '6px 14px', background: 'var(--cream)', border: '1px solid var(--cloud)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                            <button onClick={() => handleDelete(p.id)} style={{ padding: '6px 14px', background: '#fff0f0', border: '1px solid #fcc', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', color: '#c0392b', fontWeight: 500 }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--mink)' }}>No products yet</div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {tab === 'orders' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, marginBottom: '20px' }}>All Orders</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {orders.map(order => (
                  <div key={order.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 6px var(--shadow)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontWeight: 600, marginBottom: '2px' }}>Order #{order.id}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--mink)' }}>{order.user_name} • {order.user_email}</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--mink)' }}>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--rose-dark)' }}>
                          ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
                        </div>
                        <select
                          value={order.status}
                          onChange={e => handleStatusUpdate(order.id, e.target.value)}
                          style={{ padding: '6px 12px', border: '1.5px solid var(--cloud)', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', background: 'white' }}
                        >
                          {['Pending', 'Confirmed', 'Shipped', 'Delivered'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {order.items?.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--mink)', borderTop: '1px solid var(--cloud)', paddingTop: '8px', marginTop: '8px' }}>
                        <span>{item.product_name} × {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {order.transaction_id && <p style={{ fontSize: '0.75rem', color: 'var(--mink)', marginTop: '8px' }}>TxnID: <strong>{order.transaction_id}</strong></p>}
                    {/* Add this after transaction_id display in the orders map */}
{order.payment_screenshot && (
  <div style={{ marginTop: '12px' }}>
    <p style={{ fontSize: '0.75rem', color: 'var(--mink)', marginBottom: '6px', fontWeight: 500 }}>
      📸 Payment Screenshot:
    </p>
    <img
      src={`data:${order.screenshot_mimetype || 'image/jpeg'};base64,${order.payment_screenshot}`}
      alt="Payment proof"
      style={{
        maxWidth: '200px',
        maxHeight: '200px',
        borderRadius: '8px',
        objectFit: 'contain',
        border: '1px solid var(--cloud)',
        cursor: 'pointer'
      }}
      onClick={() => window.open(`data:${order.screenshot_mimetype || 'image/jpeg'};base64,${order.payment_screenshot}`, '_blank')}
      title="Click to view full screenshot"
        />
      </div>
    )}
                      </div>
                ))}
                {orders.length === 0 && <div style={{ textAlign: 'center', padding: '60px', color: 'var(--mink)' }}>No orders yet</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400 }}>
                {editProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => setShowProductForm(false)} style={{ fontSize: '1.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mink)', lineHeight: 1 }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">Product Image</label>
                <div onClick={() => fileInputRef.current.click()} style={{
                  border: '2px dashed var(--cloud)', borderRadius: '12px', padding: '24px',
                  textAlign: 'center', cursor: 'pointer', background: 'var(--cream)',
                  transition: 'border-color 0.2s'
                }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ maxHeight: '150px', borderRadius: '8px', objectFit: 'contain' }} />
                  ) : (
                    <div>
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📷</div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--mink)' }}>Click to upload image</p>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </div>

              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="form-input" rows={3} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="form-select">
                    <option>Hair Accessories</option>
                    <option>Hampers</option>
                    <option>Bouquets</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="form-input" required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Available</label>
                  <select value={formData.available} onChange={e => setFormData({...formData, available: e.target.value === 'true'})} className="form-select">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowProductForm(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" disabled={formLoading} className="btn-primary" style={{ flex: 2, justifyContent: 'center', padding: '14px' }}>
                  {formLoading ? 'Saving...' : (editProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
