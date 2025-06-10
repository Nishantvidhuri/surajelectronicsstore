import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://backendsurajelectronic.onrender.com/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setFormData({
          name: data.name,
          price: data.price,
          description: data.description,
          image: data.image,
          category: data.category
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backendsurajelectronic.onrender.com/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      setMessage({ type: 'success', text: 'Product updated successfully!' });
      setTimeout(() => navigate('/admin/products'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Edit Product</h1>

        {message.text && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Product Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter product price"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Image URL:</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter product image URL"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Category:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter product category"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Product
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct; 