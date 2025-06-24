import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get('/leaves');
        setLeaves(res.data);
      } catch (err) {
        console.error('Failed to load leave requests:', err);
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Leave Requests</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Employee</th>
              <th className="px-4 py-2 text-left">Leave Type</th>
              <th className="px-4 py-2 text-left">From</th>
              <th className="px-4 py-2 text-left">To</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Reason</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave.id} className="border-t">
                  <td className="px-4 py-2">
                    {leave.first_name} {leave.last_name}
                  </td>
                  <td className="px-4 py-2">{leave.leave_type}</td>
                  <td className="px-4 py-2">{leave.start_date}</td>
                  <td className="px-4 py-2">{leave.end_date}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        leave.status === 'Approved'
                          ? 'bg-green-100 text-green-700'
                          : leave.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{leave.reason}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequests;
