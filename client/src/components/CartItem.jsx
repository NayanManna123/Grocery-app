import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity, productId } = item;

  return (
    <div className="cart-item" id={`cart-item-${productId}`}>
      <img
        className="cart-item-image"
        src={product.image}
        alt={product.name}
        onError={(e) => {
          e.target.src = `https://placehold.co/80x80/1a2332/4ade80?text=${encodeURIComponent(product.name)}`;
        }}
      />
      <div className="cart-item-details">
        <div className="cart-item-name">{product.name}</div>
        <div className="cart-item-price">
          ₹{product.price.toFixed(2)} / {product.unit}
        </div>
      </div>
      <div className="quantity-controls">
        <button
          className="qty-btn"
          onClick={() => updateQuantity(productId, quantity - 1)}
          id={`qty-dec-${productId}`}
        >
          −
        </button>
        <span className="qty-value">{quantity}</span>
        <button
          className="qty-btn"
          onClick={() => updateQuantity(productId, quantity + 1)}
          id={`qty-inc-${productId}`}
        >
          +
        </button>
      </div>
      <div style={{ fontWeight: 600, minWidth: 70, textAlign: 'right' }}>
        ₹{(product.price * quantity).toFixed(2)}
      </div>
      <button
        className="btn-remove-item"
        onClick={() => removeItem(productId)}
        id={`remove-${productId}`}
        title="Remove item"
      >
        ✕
      </button>
    </div>
  );
}
