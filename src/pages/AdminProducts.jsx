import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

function AdminProducts() {
  const { user, isLoggedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  if (!isLoggedIn || !user?.isAdmin) return <Navigate to="/login" replace />;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete product');
        const updated = products.filter(p => p._id !== productId);
        setProducts(updated);
        setFiltered(updated);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleStockToggle = async (productId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ inStock: !currentStatus })
      });
      if (!response.ok) throw new Error('Failed to update stock');
      const updated = products.map(p =>
        p._id === productId ? { ...p, inStock: !currentStatus } : p
      );
      setProducts(updated);
      setFiltered(updated);
    } catch (err) {
      alert('Stock update failed');
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    setFiltered(
      products.filter(
        p =>
          p.name.toLowerCase().includes(val) ||
          p.category.toLowerCase().includes(val)
      )
    );
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg text-gray-500">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 pt-40 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-blue-700">Manage Products</h1>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by name or category..."
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Link
              to="/admin/products/add"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              + Add Product
            </Link>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 text-lg mt-20">
            No products match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(product => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-1 text-gray-900">{product.name}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-blue-600">₹{product.price.toFixed(2)}</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{product.category}</span>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">Stock:</span>
                    <button
                      onClick={() => handleStockToggle(product._id, product.inStock)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                        product.inStock ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          product.inStock ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
