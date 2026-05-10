const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample products data
const products = [
  { id: 1, name: 'Laptop', price: 999.99, description: 'High-performance laptop' },
  { id: 2, name: 'Mouse', price: 29.99, description: 'Wireless mouse' },
  { id: 3, name: 'Keyboard', price: 79.99, description: 'Mechanical keyboard' },
  { id: 4, name: 'Monitor', price: 299.99, description: '27-inch 4K monitor' },
  { id: 5, name: 'Headphones', price: 149.99, description: 'Noise-cancelling headphones' }
];

// Payments storage (in-memory for this demo)
const payments = [];

// Routes

// GET all products
app.get('/api/products', (req, res) => {
  console.log('GET /api/products');
  res.json(products);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST payment
app.post('/api/payments', (req, res) => {
  const { cartItems, totalAmount, customer } = req.body;

  if (!cartItems || !totalAmount || !customer) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const payment = {
    id: payments.length + 1,
    cartItems,
    totalAmount,
    customer,
    timestamp: new Date().toISOString(),
    status: 'completed'
  };

  payments.push(payment);
  console.log('Payment received:', payment);
  res.status(201).json({ success: true, payment });
});

// GET all payments (for admin purposes)
app.get('/api/payments', (req, res) => {
  res.json(payments);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
