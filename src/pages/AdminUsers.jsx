import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

function AdminUsers() {
  const { user, isLoggedIn } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!isLoggedIn || !user?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message || 'Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete user.');
        }

        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError(err.message || 'Failed to delete user.');
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-20 flex justify-center items-center min-h-screen bg-white text-gray-700">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return <div className="pt-20 flex justify-center items-center text-red-500 min-h-screen bg-white">Error: {error}</div>;
  }

  return (
    <div className="pt-32 pb-10 min-h-screen bg-white text-gray-800 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

        {users.length === 0 ? (
          <div className="text-center text-gray-500 text-xl mt-10">No users found.</div>
        ) : (
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-md overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-3 text-sm text-right"></th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{user.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.isAdmin ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <Link to={`/admin/users/edit/${user._id}`} className="text-blue-600 hover:underline mr-4">Edit</Link>
                      {!user.isAdmin && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
