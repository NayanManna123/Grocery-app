import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="logo-icon">🛒</span>
          <span>FreshCart</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={isActive('/')} id="nav-home">
            <span className="icon">🏠</span>
            <span>Shop</span>
          </Link>

          {user ? (
            <>
              <Link to="/cart" className={isActive('/cart')} id="nav-cart">
                <span className="icon">🛒</span>
                <span>Cart</span>
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>
              <Link to="/orders" className={isActive('/orders')} id="nav-orders">
                <span className="icon">📦</span>
                <span>Orders</span>
              </Link>
              <div className="nav-user-section">
                <span className="nav-user-name">👋 {user.name}</span>
                <button className="btn-logout" onClick={logout} id="btn-logout">Logout</button>
              </div>
            </>
          ) : (
            <Link to="/login" className={isActive('/login')} id="nav-login">
              <span className="icon">👤</span>
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
