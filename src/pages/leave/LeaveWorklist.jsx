import React, { useEffect, useState } from "react";
import axios from "../../services/axios";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const LeaveWorklist = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`/leave-worklist/${user?.employee?.id}`);
      setLeaves(res.data);
    } catch (err) {
      console.error("Failed to fetch leave worklist", err);
    }
  };

  const handleAction = async (leaveId, action) => {
    try {
      await axios.put(`/leaves/${leaveId}/status`, action);
      Swal.fire({
        icon: "success",
        title: `Leave ${action}`,
        text: `Leave has been ${action.toLowerCase()} successfully.`,
      });
      fetchLeaves();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to update leave status.",
      });
    }
  };

  useEffect(() => {
    if (user?.employee?.id) fetchLeaves();
  }, [user]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Leave Worklist</h1>

      {leaves.length === 0 ? (
        <p>There are no pending leaves.</p>
      ) : (
        <table className="w-full bg-white rounded shadow overflow-hidden text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Employee Name</th>
              <th className="px-4 py-2 text-left">Leave Type</th>
              <th className="px-4 py-2 text-left">From</th>
              <th className="px-4 py-2 text-left">To</th>
              <th className="px-4 py-2 text-left">Reason</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id} className="border-t">
                <td className="px-4 py-2">{leave.employee_name}</td>
                <td className="px-4 py-2">{leave.leave_type}</td>
                <td className="px-4 py-2">{leave.start_date}</td>
                <td className="px-4 py-2">{leave.end_date}</td>
                <td className="px-4 py-2">{leave.reason}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleAction(leave.id, "Approved")}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(leave.id, "Rejected")}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveWorklist;
