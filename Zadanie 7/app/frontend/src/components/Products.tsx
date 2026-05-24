import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);
        setProducts(res.data);
      } catch {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAdd = (p: Product) => {
    addItem({ id: p.id, name: p.name, price: p.price, quantity: 1 });
    setLastAdded(p.name);
  };

  if (loading) return <div className="container" data-testid="products-loading">Loading products...</div>;
  if (error) return <div className="container error" data-testid="products-error">{error}</div>;

  return (
    <div className="container">
      <h1>Products</h1>
      {lastAdded && (
        <div className="success" data-testid="products-added">
          Added {lastAdded} to cart
        </div>
      )}
      <div className="products-grid" data-testid="products-grid">
        {products.map(p => (
          <div key={p.id} className="product-card" data-testid={`product-${p.id}`}>
            <h3 data-testid={`product-${p.id}-name`}>{p.name}</h3>
            <p>{p.description}</p>
            <p data-testid={`product-${p.id}-price`}>${p.price.toFixed(2)}</p>
            <button data-testid={`product-${p.id}-add`} onClick={() => handleAdd(p)}>
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
