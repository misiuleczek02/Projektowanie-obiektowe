import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Products from './components/Products';
import Cart from './components/Cart';
import Register from './components/Register';
import Login from './components/Login';
import Account from './components/Account';

const NavBar: React.FC = () => {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" data-testid="nav-products">
        Products
      </Link>
      <Link to="/cart" data-testid="nav-cart">
        Cart (<span data-testid="nav-cart-count">{getTotalItems()}</span>)
      </Link>
      <span className="spacer" />
      {user ? (
        <>
          <Link to="/account" data-testid="nav-account">
            Account
          </Link>
          <span data-testid="nav-user">{user.email}</span>
          <button data-testid="nav-logout" className="secondary" onClick={() => logout()}>
            Log out
          </button>
        </>
      ) : (
        <>
          <Link to="/login" data-testid="nav-login">
            Log in
          </Link>
          <Link to="/register" data-testid="nav-register">
            Register
          </Link>
        </>
      )}
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
