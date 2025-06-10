import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function AdminOrders() {
  const { user, isLoggedIn, loadingAuth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('date-desc');
  const [statusFilter, setStatusFilter] = useState('all');

  const authCheck = useMemo(() => ({
    loadingAuth,
    isLoggedIn,
    isAdmin: user?.isAdmin
  }), [loadingAuth, isLoggedIn, user?.isAdmin]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        (order._id?.toLowerCase().includes(searchLower) || false) ||
        (order.user?.email?.toLowerCase().includes(searchLower) || false) ||
        (order.orderItems?.some(item =>
          item.product?.name?.toLowerCase().includes(searchLower)
        ) || false);

      const orderDate = new Date(order.createdAt);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;
      const matchesDate =
        (!startDate || orderDate >= startDate) &&
        (!endDate || orderDate <= endDate);

      const matchesPrice =
        (!priceRange.min || order.totalPrice >= Number(priceRange.min)) &&
        (!priceRange.max || order.totalPrice <= Number(priceRange.max));

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesDate && matchesPrice && matchesStatus;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'date-desc': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-desc': return (b.totalPrice || 0) - (a.totalPrice || 0);
        case 'price-asc': return (a.totalPrice || 0) - (b.totalPrice || 0);
        case 'name-asc': return (a.user?.email || '').localeCompare(b.user?.email || '');
        case 'name-desc': return (b.user?.email || '').localeCompare(a.user?.email || '');
        default: return 0;
      }
    });
  }, [orders, searchQuery, dateRange, priceRange, sortBy, statusFilter]);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      if (!isLoggedIn || !user?.isAdmin) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://backendsurajelectronic.onrender.com/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch orders');

        const data = await response.json();
        if (isMounted) {
          setOrders(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        if (isMounted) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchOrders();
    return () => { isMounted = false; };
  }, [isLoggedIn, user?.isAdmin]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://backendsurajelectronic.onrender.com/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Update failed');
    } catch (err) {
      console.error(err);
    }
  };

  if (loadingAuth) return <div className="text-center mt-40">Loading Auth...</div>;
  if (!isLoggedIn) return <Navigate to="/login" />;
  if (!user?.isAdmin) return <Navigate to="/" />;
  if (loading) return <div className="text-center mt-40">Loading Orders...</div>;
  if (error) return <div className="text-red-600 text-center mt-40">{error}</div>;

  return (
    <div className="pt-40 min-h-screen bg-white text-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Order Management
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar: Status Filter */}
          <div className="md:w-64 w-full space-y-2">
            {['received', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
              <div
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded cursor-pointer font-medium capitalize text-left ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-blue-100 text-gray-800'
                }`}
              >
                {status}
              </div>
            ))}
            <div
              onClick={() => setStatusFilter('all')}
              className={`mt-3 px-4 py-2 rounded cursor-pointer font-medium ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-blue-100 text-gray-800'
              }`}
            >
              All
            </div>
          </div>

          {/* Right Panel: Orders */}
          <div className="flex-1 space-y-6">
            {filteredOrders.length === 0 && (
              <p className="text-gray-500 text-center">No orders found for this status.</p>
            )}

            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Order #{order._id.slice(-6)}</h2>
                    <p className="text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="mt-4 md:mt-0 px-4 py-2 rounded-full border text-sm font-medium text-gray-800 bg-gray-100"
                  >
                    <option value="received">Received</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-100 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-2">Customer</h3>
                    <p>Email: {order.user?.email}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-2">Shipping</h3>
                    <p>{order.shippingAddress?.address}</p>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-3">Items</h3>
                  {order.orderItems.map(item => (
                    <div key={item._id} className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 bg-white rounded" />
                        <div>
                          <p>{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-blue-600">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600">Total Items: {order.orderItems.reduce((a, b) => a + b.quantity, 0)}</p>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-blue-600">₹{order.totalPrice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
