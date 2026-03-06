import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORY_MAP = {
  'hair-accessories': 'Hair Accessories',
  'hampers': 'Hampers',
  'bouquets': 'Bouquets'
};

const CATEGORY_HERO = {
  'Hair Accessories': { emoji: '💝', desc: 'Clips, pins, headbands, scrunchies and more', bg: 'linear-gradient(135deg, #fdf0ec, #faf7f2)' },
  'Hampers': { emoji: '🎁', desc: 'Curated gift hampers for every occasion', bg: 'linear-gradient(135deg, #fdfaec, #faf7f2)' },
  'Bouquets': { emoji: '💐', desc: 'Fresh and dried floral arrangements', bg: 'linear-gradient(135deg, #f0f5f0, #faf7f2)' },
  'All': { emoji: '✨', desc: 'Browse our full collection', bg: 'linear-gradient(135deg, #f5f0eb, #faf7f2)' }
};

export default function Products() {
  const location = useLocation();
  const pathSegment = location.pathname.split('/')[1];
  const categoryFromPath = CATEGORY_MAP[pathSegment];

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryFromPath || 'All');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    setActiveCategory(categoryFromPath || 'All');
  }, [location.pathname]);

  useEffect(() => {
    setLoading(true);
    api.get('/api/products').then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);
    if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'newest') result = [...result].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setFiltered(result);
  }, [products, activeCategory, sort]);

  const heroData = CATEGORY_HERO[activeCategory] || CATEGORY_HERO['All'];
  const categories = ['All', 'Hair Accessories', 'Hampers', 'Bouquets'];

  return (
    <div className="page-wrapper">
      {/* Hero Banner */}
      <div style={{
        background: heroData.bg,
        padding: '60px 0 40px',
        textAlign: 'center',
        borderBottom: '1px solid var(--cloud)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{heroData.emoji}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400, color: 'var(--espresso)', marginBottom: '8px' }}>
          {activeCategory === 'All' ? 'All Products' : activeCategory}
        </h1>
        <p style={{ color: 'var(--mink)', fontSize: '0.95rem' }}>{heroData.desc}</p>
      </div>

      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: '8px 18px',
                borderRadius: '100px',
                border: '1.5px solid',
                borderColor: activeCategory === cat ? 'var(--rose)' : 'var(--cloud)',
                background: activeCategory === cat ? 'var(--rose)' : 'white',
                color: activeCategory === cat ? 'white' : 'var(--espresso)',
                fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                transition: 'var(--transition)'
              }}>{cat}</button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} className="form-select" style={{ width: 'auto', padding: '8px 14px', fontSize: '0.8rem' }}>
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--mink)', marginBottom: '24px' }}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
        </p>

        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No products found</div>
            <div className="empty-state-text">Try a different category or check back soon!</div>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
