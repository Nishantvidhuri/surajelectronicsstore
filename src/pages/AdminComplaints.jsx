import React, { useEffect, useState } from 'react';

const statusOptions = ['Pending', 'Processing', 'Resolved', 'Rejected'];

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/complaints/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const updatedComplaint = await res.json();

      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: updatedComplaint.status } : c))
      );
    } catch (err) {
      console.error("Failed to update complaint status:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  if (loading) return <div className="p-8 text-center text-lg font-medium">Loading complaints...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white pt-24 px-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">📋 Complaints Dashboard</h1>

      <div className="overflow-x-auto shadow-xl rounded-xl bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Issue</th>
              <th className="px-6 py-3 text-left">Model</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {complaints.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4">{c.user?.name || "N/A"}</td>
                <td className="px-6 py-4">{c.user?.email || "N/A"}</td>
                <td className="px-6 py-4">{c.phoneNumber || "N/A"}</td>
                <td className="px-6 py-4">{c.issue}</td>
                <td className="px-6 py-4 text-gray-600 font-medium">{c.model}</td>
                <td className="px-6 py-4">
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c._id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm border-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      c.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : c.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : c.status === "Resolved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminComplaints;
