import React, { useState } from 'react';

const LeaveForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    start_date: '',
    end_date: '',
    type:'',
    reason: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.start_date || !form.end_date || !form.reason) {
      alert('All fields are required');
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Start Date</label>
        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">End Date</label>
        <input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
    <div>
        <label className="block text-sm font-medium mb-1">Leave Type</label>
        <input type="text" name="type" value={form.type} onChange={handleChange} placeholder="Leave Type (CL, EL etc)" className="input" required />

      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Reason</label>
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>

      
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
          Cancel
        </button>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </div>
    </form>
  );
};

export default LeaveForm;
