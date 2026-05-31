const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: (origin, cb) => cb(null, true),
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const products = [
  { id: 1, name: 'Laptop', price: 999.99, description: 'High-performance laptop' },
  { id: 2, name: 'Mouse', price: 29.99, description: 'Wireless mouse' },
  { id: 3, name: 'Keyboard', price: 79.99, description: 'Mechanical keyboard' },
  { id: 4, name: 'Monitor', price: 299.99, description: '27-inch 4K monitor' },
  { id: 5, name: 'Headphones', price: 149.99, description: 'Noise-cancelling headphones' }
];

const users = new Map();
const sessions = new Map();
const payments = [];

function makeSessionId() {
  return crypto.randomBytes(24).toString('hex');
}

function authMiddleware(req, res, next) {
  const sid = req.cookies && req.cookies.sid;
  if (!sid || !sessions.has(sid)) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const email = sessions.get(sid);
  const user = users.get(email);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  req.user = user;
  req.sid = sid;
  next();
}

app.get('/api/health', (_req, res) => res.json({ status: 'OK' }));

app.get('/api/products', (_req, res) => res.json(products));

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id, 10));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/register', (req, res) => {
  const { email, password, fullName } = req.body || {};

  const missing = [];
  if (!email || !String(email).trim()) missing.push('email');
  if (!password || !String(password).trim()) missing.push('password');
  if (!fullName || !String(fullName).trim()) missing.push('fullName');
  if (missing.length) {
    return res.status(400).json({ error: 'Missing required fields', missing });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (users.has(email)) {
    return res.status(409).json({ error: 'User already exists' });
  }

  users.set(email, {
    email,
    password,
    fullName,
    address: '',
    notificationsEmail: email
  });

  res.status(201).json({ success: true, email });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  const user = users.get(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const sid = makeSessionId();
  sessions.set(sid, email);
  res.cookie('sid', sid, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false
  });
  res.json({ success: true, user: { email: user.email, fullName: user.fullName } });
});

app.post('/api/logout', (req, res) => {
  const sid = req.cookies && req.cookies.sid;
  if (sid) sessions.delete(sid);
  res.clearCookie('sid');
  res.json({ success: true });
});

app.get('/api/account', authMiddleware, (req, res) => {
  const { email, fullName, address, notificationsEmail } = req.user;
  res.json({ email, fullName, address, notificationsEmail });
});

// celowo podatne na CSRF - brak tokena, brak sprawdzania Origin, przyjmuje urlencoded
app.post('/api/account/update', authMiddleware, (req, res) => {
  const { fullName, address, notificationsEmail } = req.body || {};
  if (typeof fullName === 'string' && fullName.length) req.user.fullName = fullName;
  if (typeof address === 'string') req.user.address = address;
  if (typeof notificationsEmail === 'string' && notificationsEmail.length) {
    req.user.notificationsEmail = notificationsEmail;
  }
  res.json({
    success: true,
    user: {
      email: req.user.email,
      fullName: req.user.fullName,
      address: req.user.address,
      notificationsEmail: req.user.notificationsEmail
    }
  });
});

app.post('/api/payments', (req, res) => {
  const { cartItems, totalAmount, customer } = req.body || {};
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
  res.status(201).json({ success: true, payment });
});

app.get('/api/payments', (_req, res) => res.json(payments));

app.post('/api/_test/reset', (_req, res) => {
  users.clear();
  sessions.clear();
  payments.length = 0;
  res.json({ success: true });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
  console.log(`Allowing frontend origin: ${FRONTEND_ORIGIN}`);
});
