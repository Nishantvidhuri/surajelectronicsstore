import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

function AdminDashboard() {
  const { user, isLoggedIn, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div className="pt-40 min-h-screen bg-gray-50 text-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!user?.isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="pt-40 min-h-screen bg-gray-50 text-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center text-blue-600">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Users Management */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 transform transition hover:scale-105 hover:shadow-blue-300/40">
            <h2 className="text-xl font-semibold mb-4">Users Management</h2>
            <p className="text-gray-600 mb-6">Manage user accounts, view user details, and handle user-related operations.</p>
            <Link
              to="/admin/users"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-md"
            >
              Manage Users
            </Link>
          </div>

          {/* Products Management */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 transform transition hover:scale-105 hover:shadow-blue-300/40">
            <h2 className="text-xl font-semibold mb-4">Products Management</h2>
            <p className="text-gray-600 mb-6">Add, edit, or remove products from the store. Manage product inventory and details.</p>
            <Link
              to="/admin/products"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-md"
            >
              Manage Products
            </Link>
          </div>

          {/* Orders Management */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 transform transition hover:scale-105 hover:shadow-blue-300/40">
            <h2 className="text-xl font-semibold mb-4">Orders Management</h2>
            <p className="text-gray-600 mb-6">View and update customer orders.</p>
            <Link
              to="/admin/orders"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-md"
            >
              Manage Orders
            </Link>
          </div>

          {/* Complaints Management */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 transform transition hover:scale-105 hover:shadow-blue-300/40">
            <h2 className="text-xl font-semibold mb-4">Complaints Management</h2>
            <p className="text-gray-600 mb-6">View and respond to customer complaints. Track complaint status and resolution.</p>
            <Link
              to="/admin/complaints"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-md"
            >
              Manage Complaints
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
