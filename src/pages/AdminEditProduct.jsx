import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isLoggedIn } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isLoggedIn || !currentUser?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setFormData({
          name: data.name || '',
          description: data.description || '',
          price: data.price !== undefined ? String(data.price) : '',
          image: data.image || '',
        });
      } catch (err) {
        setError(err.message || 'Failed to load product data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product.');
      }

      setSuccessMessage('Product updated successfully!');
      setTimeout(() => navigate('/admin/products'), 2000);
    } catch (err) {
      setUpdateError(err.message || 'Failed to update product.');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex justify-center items-center bg-white text-gray-700">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-400 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen flex justify-center items-center bg-white text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="pt-28 min-h-screen bg-gray-50 text-gray-800 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-semibold text-center mb-6">Edit Product</h1>

        {successMessage && (
          <div className="bg-green-100 text-green-700 border border-green-300 p-3 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}
        {updateError && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded mb-4 text-center">
            {updateError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block font-medium text-sm">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium text-sm">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block font-medium text-sm">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block font-medium text-sm">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {formData.image && (
            <div className="mt-4 text-center">
              <img
                src={formData.image}
                alt="Preview"
                className="w-48 h-48 object-contain mx-auto rounded-lg border border-gray-300"
              />
              <p className="text-sm text-gray-400 mt-1">Image Preview</p>
            </div>
          )}

          <button
            type="submit"
            disabled={updateLoading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {updateLoading ? 'Updating...' : 'Update Product'}
          </button>

          <div className="text-center mt-4">
            <Link to="/admin/products" className="text-blue-500 hover:underline">
              Back to Product List
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminEditProduct;
