import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    await addToCart(product.id);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div className="product-card" id={`product-${product.id}`}>
      <div className="product-card-image-wrapper">
        <img
          className="product-card-image"
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x300/1a2332/4ade80?text=${encodeURIComponent(product.name)}`;
          }}
        />
        {product.featured && <span className="product-card-badge">⭐ Featured</span>}
      </div>
      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-desc">{product.description}</p>
        <div className="product-card-footer">
          <div className="product-price">
            ₹{product.price.toFixed(2)}
            <span className="unit">/{product.unit}</span>
          </div>
          <button
            className={`btn-add-cart ${adding ? 'added' : ''}`}
            onClick={handleAdd}
            id={`add-cart-${product.id}`}
          >
            {adding ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
