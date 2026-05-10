import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Payments.css';

const Payments: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    email: '',
    address: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const validateCardNumber = (cardNumber: string): boolean => {
    // Remove spaces and check if it's 13-19 digits
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
  };

  const validateExpiryDate = (expiryDate: string): boolean => {
    // Check MM/YY format
    const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1]);
    const year = parseInt(match[2]) + 2000;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    return month >= 1 && month <= 12 && year >= currentYear && (year > currentYear || month >= currentMonth);
  };

  const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
  };

  const formatCardNumber = (value: string): string => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError('Cart is empty. Please add items before payment.');
      return;
    }

    if (!formData.cardName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
      setError('Please fill in all payment details.');
      return;
    }

    if (!validateCardNumber(formData.cardNumber)) {
      setError('Please enter a valid card number (13-19 digits).');
      return;
    }

    if (!validateExpiryDate(formData.expiryDate)) {
      setError('Please enter a valid expiry date (MM/YY) that is not expired.');
      return;
    }

    if (!validateCVV(formData.cvv)) {
      setError('Please enter a valid CVV (3-4 digits).');
      return;
    }

    try {
      setLoading(true);
      const paymentData = {
        cartItems: items,
        totalAmount: getTotalPrice(),
        customer: {
          name: formData.cardName,
          email: formData.email,
          address: formData.address
        }
      };

      const response = await axios.post(`${API_URL}/api/payments`, paymentData);

      if (response.status === 201) {
        setSuccess(true);
        clearCart();
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="payments-container">
        <div className="success-message">
          <h1>Payment Successful!</h1>
          <p>Thank you for your purchase. You will be redirected shortly...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="payments-container">
        <h1>Payment</h1>
        <p className="empty-cart">Your cart is empty. Please add items before checkout.</p>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="payments-container">
      <h1>Payment Information</h1>

      <div className="payment-layout">
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {items.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <strong>Total: ${getTotalPrice().toFixed(2)}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Cardholder Name</label>
            <input
              type="text"
              name="cardName"
              value={formData.cardName}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Main St, City, State"
            />
          </div>

          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="back-btn"
            >
              Back to Cart
            </button>
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Processing...' : 'Complete Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payments;
