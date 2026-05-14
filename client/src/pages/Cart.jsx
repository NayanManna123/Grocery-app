import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { items, itemCount, total, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container"><div className="spinner"></div></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-container">
        <h1 className="page-title"><span className="icon">🛒</span>Your Cart</h1>
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some fresh groceries to get started!</p>
          <Link to="/" className="btn-shop">🏠 Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title"><span className="icon">🛒</span>Your Cart</h1>

      <div className="cart-layout">
        <div className="cart-items-list">
          {items.map(item => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row label">
            <span>Items ({itemCount})</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="summary-row label">
            <span>Delivery</span>
            <span style={{ color: '#22c55e', fontWeight: 600 }}>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span className="total-price">₹{total.toFixed(2)}</span>
          </div>
          <button
            className="btn-checkout"
            onClick={() => navigate('/checkout')}
            id="btn-checkout"
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}
