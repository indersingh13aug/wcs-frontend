import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import LeaveRequestForm from '../../components/Forms/LeaveRequestForm';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
const LeaveRequest = () => {
  const { user } = useAuth();
  const employeeId = user?.employee?.id;

  const [leaves, setLeaves] = useState([]);
  const [summary, setSummary] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Fetch leave applications
  const fetchLeaves = async () => {
    if (!employeeId) return;
    try {
      const res = await axios.get(`/leaves_req?employee_id=${employeeId}`);
      setLeaves(res.data);
    } catch (err) {
      console.error('Error fetching leaves', err);
    }
  };

  // Fetch leave summary
  const fetchSummary = async () => {
    if (!employeeId) return;
    try {
      const res = await axios.get(`/leaves-summary?employee_id=${employeeId}`);
      setSummary(res.data);
    } catch (err) {
      console.error('Error fetching leave summary', err);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchLeaves();
      fetchSummary();
    }
  }, [employeeId]);

  const handleLeaveSubmit = async (formData) => {
    try {
      await axios.post('/leaves', { ...formData, employee_id: employeeId });
      setShowForm(false);
      fetchLeaves();
      fetchSummary();
    } catch (err) {
      Swal.fire({icon: 'error',title: 'Error',text: 'Failed to apply leave',});
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      

      {/* ✅ Summary Table */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Leave Summary (FY)</h2>
        <table className="w-full bg-white rounded shadow overflow-hidden text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Leave Type</th>
              <th className="px-4 py-2 text-left">Total Leaves</th>
              <th className="px-4 py-2 text-left">Applied</th>
              <th className="px-4 py-2 text-left">Pending</th>
              <th className="px-4 py-2 text-left">Approved</th>
              <th className="px-4 py-2 text-left">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((row) => {
              const remaining = row.total - (row.pending + row.approved);
              return (
                <tr key={row.leave_type_id} className="border-t">
                  <td className="px-4 py-2">{row.leave_type_name}</td>
                  <td className="px-4 py-2">{row.total_leaves}</td>
                  <td className="px-4 py-2">{row.applied_leaves}</td>
                  <td className="px-4 py-2">{row.pending_leaves}</td>
                  <td className="px-4 py-2">{row.approved_leaves}</td>
                  <td className="px-4 py-2">
                    {row.total_leaves - (row.pending_leaves + row.approved_leaves)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Leave Requests</h1>
        {!showForm && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setShowForm(true)}
          >
            Apply Leave
          </button>
        )}
      </div>
      {showForm && (
        <div className="mb-6">
          <LeaveRequestForm onSubmit={handleLeaveSubmit} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* ✅ Leave Application List */}
      <table className="w-full bg-white rounded shadow overflow-hidden text-sm">
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
              <td className="px-4 py-2">{leave.leave_type?.name || '-'}</td>
              <td className="px-4 py-2">{leave.start_date}</td>
              <td className="px-4 py-2">{leave.end_date}</td>
              <td className="px-4 py-2">{leave.reason}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-sm ${leave.status === 'Approved'
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

export default LeaveRequest;
