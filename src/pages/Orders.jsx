import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function Orders() {
  const { user, isLoggedIn, loadingAuth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (loadingAuth) {
    return (
      <div className="pt-40 min-h-screen bg-gray-50 text-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/orders/my', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!loadingAuth && isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn, loadingAuth]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel order.');
      }

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
    } catch (error) {
      console.error('Error cancelling order:', error.message);
    }
  };

  if (loading) {
    return (
      <div className="pt-40 min-h-screen bg-gray-50 text-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-40 min-h-screen bg-gray-50 text-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="pt-40 min-h-screen bg-gray-50 text-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center text-blue-600">
          My Order History
        </h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-500 text-xl">No orders found.</div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md p-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Order #{order._id.slice(-6)}</h2>
                    <p className="text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold
                      ${!order.status || order.status === 'received' ? 'bg-gray-100 text-gray-500' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                        order.status === 'shipped' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'}`}>
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-3">Customer Details</h3>
                    <p>Email: {order.user.email}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                    <p>{order.shippingAddress.area}</p>
                    {order.shippingAddress.landmark && <p>Landmark: {order.shippingAddress.landmark}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    <p>{order.shippingAddress.pincode}</p>
                    {order.shippingAddress.instructions && <p>Instructions: {order.shippingAddress.instructions}</p>}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div key={item._id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-contain bg-white border rounded-lg"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-blue-600 font-semibold">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600">Total Items: {order.orderItems.reduce((acc, item) => acc + item.quantity, 0)}</p>
                  <div className="text-right">
                    <p className="text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-600">₹{order.totalPrice}</p>
                  </div>
                </div>

                {order.status === 'processing' && (
                  <div className="flex justify-end items-center pt-4">
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
