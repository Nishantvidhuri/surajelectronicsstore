import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminEditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isLoggedIn } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    isAdmin: false,
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
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://backendsurajelectronic.onrender.com/api/auth/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setFormData({
          username: data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          isAdmin: data.isAdmin || false,
        });
      } catch (err) {
        setError(err.message || 'Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user.');
      }

      setSuccessMessage('User updated successfully!');
      setTimeout(() => navigate('/admin/users'), 2000);
    } catch (err) {
      setUpdateError(err.message || 'Failed to update user.');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 flex justify-center items-center min-h-screen bg-white text-gray-800">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 flex justify-center items-center text-red-600 min-h-screen bg-white">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="pt-32 pb-10 min-h-screen bg-white text-gray-800 px-4">
      <div className="max-w-xl mx-auto bg-white border border-gray-200 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-6">Edit User</h1>

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
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">Is Admin</label>
          </div>

          <button
            type="submit"
            disabled={updateLoading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {updateLoading ? 'Updating...' : 'Update User'}
          </button>

          <div className="text-center mt-4">
            <Link to="/admin/users" className="text-blue-500 hover:underline">
              ← Back to User List
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminEditUser;
