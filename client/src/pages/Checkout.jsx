import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

export default function Checkout() {
  const { items, total, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user) { navigate('/login'); return null; }
  if (items.length === 0 && !success) { navigate('/cart'); return null; }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);

    try {
      await ordersAPI.place({
        address: form,
        paymentMethod,
      });
      await fetchCart();
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (success) {
    return (
      <div className="success-overlay">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h2>Order Placed!</h2>
          <p>Your groceries are on their way. Thank you for shopping with FreshCart!</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/orders" className="btn-shop" id="btn-view-orders">📦 View Orders</Link>
            <Link to="/" className="btn-shop" style={{ background: 'var(--color-bg-glass)', border: '1px solid var(--color-border)', boxShadow: 'none' }} id="btn-keep-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title"><span className="icon">📋</span>Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>🏠 Delivery Address</h3>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="street">Street Address</label>
            <input
              className="form-input" id="street" name="street"
              placeholder="123 Main St, Apt 4"
              value={form.street} onChange={handleChange} required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                className="form-input" id="city" name="city"
                placeholder="New York"
                value={form.city} onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                className="form-input" id="state" name="state"
                placeholder="NY"
                value={form.state} onChange={handleChange} required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="zip">ZIP Code</label>
            <input
              className="form-input" id="zip" name="zip"
              placeholder="10001"
              value={form.zip} onChange={handleChange} required
            />
          </div>

          <h3 style={{ marginTop: 24 }}>💳 Payment Method</h3>
          <div className="payment-options">
            {[
              { id: 'card', icon: '💳', label: 'Credit Card' },
              { id: 'cash', icon: '💵', label: 'Cash on Delivery' },
              { id: 'wallet', icon: '📱', label: 'Digital Wallet' },
            ].map(opt => (
              <button
                type="button"
                key={opt.id}
                className={`payment-option ${paymentMethod === opt.id ? 'selected' : ''}`}
                onClick={() => setPaymentMethod(opt.id)}
                id={`pay-${opt.id}`}
              >
                <div className="pay-icon">{opt.icon}</div>
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="btn-checkout"
            disabled={placing}
            style={{ marginTop: 28 }}
            id="btn-place-order"
          >
            {placing ? 'Placing Order...' : `Place Order — ₹${total.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          {items.map(item => (
            <div key={item.productId} className="summary-row label" style={{ alignItems: 'start' }}>
              <span style={{ flex: 1 }}>{item.product.name} × {item.quantity}</span>
              <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row label">
            <span>Delivery</span>
            <span style={{ color: '#22c55e', fontWeight: 600 }}>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span className="total-price">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
