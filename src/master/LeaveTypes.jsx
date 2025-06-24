import axios from '../services/axios';
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LeaveTypeForm from "../components/Forms/LeaveTypeForm";

const LeaveTypes = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);

  const fetchLeaveTypes = async () => {
    const res = await axios.get('/leave-types');
    setLeaveTypes(res.data);
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddClick = () => {
    setFormData({});
    setEditing(null);
    setShowForm(true);
  };

  const handleEditClick = (item) => {
    if (item.is_deleted) return;
    setFormData(item);
    setEditing(item);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/leave-types/${editing.id}`, formData);
      } else {
        await axios.post('/leave-types', formData);
      }
      setShowForm(false);
      fetchLeaveTypes();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.detail || "Something went wrong"
      });
    }
  };

  const handleActivate = async (id) => {
    await axios.put(`/leave-types/${id}/activate`);
    fetchLeaveTypes();
  };

  const handleDeactivate = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to deactivate this Leave Type?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, deactivate'
    });
    if (result.isConfirmed) {
      await axios.put(`/leave-types/${id}/deactivate`);
      fetchLeaveTypes();
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Leave Types</h1>
        {!showForm && (
          <button onClick={handleAddClick} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Leave Type
          </button>
        )}
      </div>

      {showForm && (
        <LeaveTypeForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table className="w-full border mt-6 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Max Days</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveTypes.map(lt => (
            <tr key={lt.id}>
              <td className="border p-2">{lt.name}</td>
              <td className="border p-2">{lt.max_days}</td>
              <td className="border p-2">{lt.description}</td>
              <td className="border p-2">
                <span className={`px-2 py-1 rounded text-sm ${lt.is_deleted ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {lt.is_deleted ? 'Inactive' : 'Active'}
                </span>
              </td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEditClick(lt)}
                  className={`px-2 py-1 rounded ${lt.is_deleted ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                  disabled={lt.is_deleted}
                >
                  Edit
                </button>
                {lt.is_deleted ? (
                  <button onClick={() => handleActivate(lt.id)} className="text-green-600 hover:underline">
                    Activate
                  </button>
                ) : (
                  <button onClick={() => handleDeactivate(lt.id)} className="text-red-600 hover:underline">
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTypes;
