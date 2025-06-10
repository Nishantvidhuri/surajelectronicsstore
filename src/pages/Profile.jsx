import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { isLoggedIn, user, login, loadingAuth } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    shippingAddress: {
      area: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      instructions: '',
    },
    isDefaultAddress: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep',
    'Delhi',
    'Puducherry',
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('https://backendsurajelectronic.onrender.com/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setFormData({
          username: data.user.username || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          shippingAddress: data.user.shippingAddress || {
            area: '',
            landmark: '',
            city: '',
            state: '',
            pincode: '',
            instructions: '',
          },
          isDefaultAddress: !!data.user.shippingAddress?.area,
        });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load profile. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    if (!loadingAuth && isLoggedIn) {
      fetchUserDetails();
    } else if (!isLoggedIn) {
      setLoading(false);
    }
  }, [isLoggedIn, loadingAuth]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('shippingAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value,
        },
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://backendsurajelectronic.onrender.com/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          shippingAddress: formData.isDefaultAddress ? formData.shippingAddress : null,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      login(data.user, token);

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile. Please try again.' });
    }
  };

  if (loadingAuth) {
    return (
      <div className="pt-40 min-h-screen bg-gray-900 text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <div className="pt-20 flex justify-center items-center text-white">Please log in to view this page.</div>;
  }

  if (loading) {
    return (
      <div className="pt-20 flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-40 flex flex-col items-center min-h-screen bg-gray-900 text-white px-4 sm:px-6 lg:px-8">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-white/10 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">User Profile</h2>
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing && user) {
                setFormData({
                  username: user.username || '',
                  email: user.email || '',
                  phone: user.phone || '',
                  shippingAddress: user.shippingAddress || {
                    area: '', landmark: '', city: '', state: '', pincode: '', instructions: ''
                  },
                  isDefaultAddress: !!user.shippingAddress?.area,
                });
              }
              setMessage({ type: '', text: '' });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {message.text && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-400 text-sm font-bold mb-2">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-400 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-400 text-sm font-bold mb-2">Phone Number:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <h3 className="text-xl font-bold text-gray-200 mt-6 mb-4">Delivery Address</h3>
          <div>
            <label htmlFor="shippingAddress.area" className="block text-sm font-medium text-gray-300 mb-1">Area, Street, Sector, Village</label>
            <input
              type="text"
              id="shippingAddress.area"
              name="shippingAddress.area"
              value={formData.shippingAddress.area}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white border border-gray-600 focus:border-blue-500 outline-none"
              disabled={!isEditing}
              required
            />
          </div>

          <div>
            <label htmlFor="shippingAddress.landmark" className="block text-sm font-medium text-gray-300 mb-1">Landmark (Optional)</label>
            <input
              type="text"
              id="shippingAddress.landmark"
              name="shippingAddress.landmark"
              value={formData.shippingAddress.landmark}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white border border-gray-600 focus:border-blue-500 outline-none"
              placeholder="E.g. near apollo hospital"
              disabled={!isEditing}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="shippingAddress.city" className="block text-sm font-medium text-gray-300 mb-1">Town/City</label>
              <input
                type="text"
                id="shippingAddress.city"
                name="shippingAddress.city"
                value={formData.shippingAddress.city}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 rounded-md text-white border border-gray-600 focus:border-blue-500 outline-none"
                disabled={!isEditing}
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="shippingAddress.state" className="block text-sm font-medium text-gray-300 mb-1">State</label>
              <select
                id="shippingAddress.state"
                name="shippingAddress.state"
                value={formData.shippingAddress.state}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 rounded-md text-white border border-gray-600 focus:border-blue-500 outline-none appearance-none"
                disabled={!isEditing}
                required
              >
                <option value="">Choose a state</option>
                {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="shippingAddress.pincode" className="block text-sm font-medium text-gray-300 mb-1">Pincode</label>
            <input
              type="text"
              id="shippingAddress.pincode"
              name="shippingAddress.pincode"
              value={formData.shippingAddress.pincode}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white border border-gray-600 focus:border-blue-500 outline-none"
              disabled={!isEditing}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefaultAddress"
              name="isDefaultAddress"
              checked={formData.isDefaultAddress}
              onChange={handleChange}
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
            />
            <label htmlFor="isDefaultAddress" className="ml-2 block text-sm text-gray-300">Set as default address</label>
          </div>

          <div>
            <label htmlFor="shippingAddress.instructions" className="block text-sm font-medium text-gray-300 mb-1">Delivery instructions (optional)</label>
            <textarea
              id="shippingAddress.instructions"
              name="shippingAddress.instructions"
              value={formData.shippingAddress.instructions}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white border border-gray-600 focus:border-blue-500 outline-none"
              disabled={!isEditing}
            ></textarea>
            <p className="text-sm text-gray-400 mt-1">Add preferences, notes, access codes and more</p>
          </div>

          {isEditing && (
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              Save Changes
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile; 