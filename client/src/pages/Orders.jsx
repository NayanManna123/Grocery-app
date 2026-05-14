import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    ordersAPI.getAll()
      .then(data => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title"><span className="icon">📦</span>Order History</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Discover fresh groceries and place your first order!</p>
          <Link to="/" className="btn-shop">🏠 Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card" id={`order-${order.id}`}>
              <div className="order-card-header">
                <span className="order-id">Order #{order.id.slice(0, 8).toUpperCase()}</span>
                <span className="order-date">{formatDate(order.createdAt)}</span>
                <span className={`order-status ${order.status}`}>
                  {order.status === 'confirmed' ? '✅' : '⏳'} {order.status}
                </span>
              </div>
              <div className="order-card-body">
                <div className="order-items-mini">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item-mini">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = `https://placehold.co/32x32/1a2332/4ade80?text=🛒`;
                        }}
                      />
                      <span>{item.name} × {item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  Total: ₹{order.total.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
