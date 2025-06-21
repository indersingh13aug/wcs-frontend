import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import LeaveForm from '../components/LeaveForm';
import { useAuth } from '../context/AuthContext';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  // console.log("Logged-in user from context:", user);
  const employeeId = user?.employee?.id;

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`/leaves?employee_id=${employeeId}`);
      setLeaves(res.data);
    } catch (err) {
      console.error('Error fetching leaves', err);
    }
  };

  useEffect(() => {
    if (employeeId) fetchLeaves();
  }, [employeeId]);

  const handleLeaveSubmit = async (formData) => {
    try {
      await axios.post('/leaves', { ...formData, employee_id: employeeId });
      setShowForm(false);
      fetchLeaves();
    } catch (err) {
      alert('Failed to apply leave');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Leave Requests</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          Apply Leave
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <LeaveForm onSubmit={handleLeaveSubmit} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Leave Type</th>
            <th className="px-4 py-2 text-left">From</th>
            <th className="px-4 py-2 text-left">To</th>
            <th className="px-4 py-2 text-left">Reason</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id} className="border-t">
              <td className="px-4 py-2">{leave.type}</td>
              <td className="px-4 py-2">{leave.start_date}</td>
              <td className="px-4 py-2">{leave.end_date}</td>
              <td className="px-4 py-2">{leave.reason}</td>
              
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaves;
