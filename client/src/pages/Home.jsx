import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getCategories()
      .then(data => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (activeCategory !== 'all') params.category = activeCategory;
        const data = await productsAPI.getAll(params);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [search, activeCategory]);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <h1>
          Fresh Groceries,<br />
          <span className="highlight">Delivered to You</span>
        </h1>
        <p>
          Browse our curated selection of premium produce, dairy, meats, and pantry essentials.
          Quality you can taste, convenience you deserve.
        </p>
      </section>

      {/* Search & Filter */}
      <div className="search-filter-bar">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search for groceries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search-input"
          />
        </div>
      </div>

      <div className="search-filter-bar" style={{ marginTop: '-1rem' }}>
        <div className="category-filters">
          <button
            className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
            id="filter-all"
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              id={`filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {cat === 'Fruits & Vegetables' ? '🥬' :
               cat === 'Dairy & Eggs' ? '🥛' :
               cat === 'Meat & Seafood' ? '🥩' :
               cat === 'Bakery' ? '🍞' :
               cat === 'Pantry' ? '🥫' :
               cat === 'Beverages' ? '🥤' :
               cat === 'Snacks' ? '🍿' : '📦'}{' '}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <section className="products-section">
        <div className="section-header">
          <h2>{activeCategory === 'all' ? 'All Products' : activeCategory}</h2>
          <span className="product-count">{products.length} items</span>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try a different search term or browse all categories.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
