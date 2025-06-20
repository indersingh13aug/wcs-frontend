import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = 'hr'; // TODO: replace with context or auth

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/leaves');
        setLeaves(res.data);
      } catch (err) {
        console.error('Failed to fetch leave data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Leave Requests</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Apply Leave
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Employee</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Start</th>
                <th className="px-4 py-2">End</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Reason</th>
                {userRole === 'hr' || userRole === 'admin' ? (
                  <th className="px-4 py-2">Actions</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{leave.employee_name || `#${leave.employee_id}`}</td>
                  <td className="px-4 py-2">{leave.leave_type}</td>
                  <td className="px-4 py-2">{leave.start_date}</td>
                  <td className="px-4 py-2">{leave.end_date}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        leave.status === 'Approved'
                          ? 'bg-green-100 text-green-600'
                          : leave.status === 'Rejected'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{leave.reason}</td>
                  {userRole === 'hr' || userRole === 'admin' ? (
                    <td className="px-4 py-2 flex gap-2">
                      <button className="bg-green-500 text-white text-sm px-2 py-1 rounded">
                        Approve
                      </button>
                      <button className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                        Reject
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaves;
