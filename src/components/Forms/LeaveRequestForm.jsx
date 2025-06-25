import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import Swal from 'sweetalert2';
const LeaveRequestForm = ({ onSubmit, onCancel }) => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [form, setForm] = useState({
    start_date: '',
    end_date: '',
    leave_type_id: '', // 👈 updated
    reason: ''
  });

  useEffect(() => {
    axios.get('/leave-types').then(res => {
      const activeTypes = res.data.filter(l => !l.is_deleted);
      setLeaveTypes(activeTypes);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { start_date, end_date, leave_type_id, reason } = form;
    if (!start_date || !end_date || !leave_type_id || !reason) {
      Swal.fire({icon: 'warning',title: 'Warning',text: 'All fields are required',});
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Start Date</label>
        <input type="date" name="start_date" value={form.start_date} onChange={handleChange}
          className="w-full border px-3 py-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">End Date</label>
        <input type="date" name="end_date" value={form.end_date} onChange={handleChange}
          className="w-full border px-3 py-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Leave Type</label>
        <select
          name="leave_type_id"
          value={form.leave_type_id}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Select Leave Type --</option>
          {leaveTypes.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Reason</label>
        <textarea name="reason" value={form.reason} onChange={handleChange}
          className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="flex gap-3">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
};

export default LeaveRequestForm;
