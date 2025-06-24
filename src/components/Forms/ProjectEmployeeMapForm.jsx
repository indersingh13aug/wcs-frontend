import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';

const ProjectEmployeeMapForm = ({ onClose }) => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    project_id: '',
    employee_ids: [],
    from_date: '',
    to_date: '',
    remarks: ''
  });

  useEffect(() => {
    axios.get('/projects').then((res) => setProjects(res.data));
    axios.get('/employees').then((res) => setEmployees(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const empId = parseInt(e.target.value);
    setForm((prev) => ({
      ...prev,
      employee_ids: e.target.checked
        ? [...prev.employee_ids, empId]
        : prev.employee_ids.filter((id) => id !== empId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { project_id, employee_ids, from_date, to_date, remarks } = form;
    if (!project_id || employee_ids.length === 0 || !from_date || !to_date) {
      alert('All fields are required');
      return;
    }

    // 👇 Save one record per employee
    await Promise.all(
      employee_ids.map((empId) =>
        axios.post('/project-employee-maps', {
          project_id,
          employee_id: empId,
          from_date,
          to_date,
          remarks
        })
      )
    );

    onClose(); // close and refresh
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
      <div className="mb-4">
        <label className="block font-medium mb-1">Project</label>
        <select
          name="project_id"
          value={form.project_id}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Select Project --</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select Employees</label>
        <div className="grid grid-cols-2 gap-2 border p-3 rounded max-h-64 overflow-y-auto">
          {employees.map((e) => (
            <label key={e.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={e.id}
                checked={form.employee_ids.includes(e.id)}
                onChange={handleCheckboxChange}
              />
              {e.first_name} {e.last_name} ({e.role_name})
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">From Date</label>
        <input type="date" name="from_date" value={form.from_date} onChange={handleChange}
          className="w-full border px-3 py-2 rounded" required />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">To Date</label>
        <input type="date" name="to_date" value={form.to_date} onChange={handleChange}
          className="w-full border px-3 py-2 rounded" required />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Remarks</label>
        <textarea name="remarks" value={form.remarks} onChange={handleChange}
          className="w-full border px-3 py-2 rounded" rows="3" required />
      </div>

      <div className="flex gap-3">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
};

export default ProjectEmployeeMapForm;
