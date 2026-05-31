import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Shopping cart</h1>
      <p>
        Items in cart: <span data-testid="cart-total-items">{getTotalItems()}</span>
      </p>
      {items.length === 0 ? (
        <p data-testid="cart-empty">Your cart is empty</p>
      ) : (
        <>
          <table data-testid="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} data-testid={`cart-row-${item.id}`}>
                  <td data-testid={`cart-name-${item.id}`}>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={item.quantity}
                      data-testid={`cart-qty-${item.id}`}
                      onChange={e => {
                        const v = parseInt(e.target.value, 10);
                        if (!Number.isNaN(v)) updateQuantity(item.id, v);
                      }}
                    />
                  </td>
                  <td data-testid={`cart-line-total-${item.id}`}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="danger"
                      data-testid={`cart-remove-${item.id}`}
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>
            Grand total:{' '}
            <span data-testid="cart-grand-total">${getTotalPrice().toFixed(2)}</span>
          </h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="secondary" data-testid="cart-continue" onClick={() => navigate('/')}>
              Continue shopping
            </button>
            <button className="secondary" data-testid="cart-clear" onClick={clearCart}>
              Clear cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
