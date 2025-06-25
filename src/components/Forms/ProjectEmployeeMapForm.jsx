import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import Swal from 'sweetalert2';
const ProjectEmployeeMapForm = ({ onClose, editData }) => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    project_id: '',
    employee_ids: [],
    from_date: '',
    to_date: '',
    remarks: ''
  });
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const [dd, mm, yyyy] = dateStr.includes('-') && dateStr.split('-').length === 3 && dateStr[2] === '-' ? dateStr.split('-') : [null];
    if (!dd) return dateStr; 
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, empRes] = await Promise.all([
          axios.get('/projects'),
          axios.get('/employees')
        ]);

        setProjects(projectRes.data || []);
        setEmployees(empRes.data || []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchData();
  }, []);

  // 🟨 Pre-fill form when editing
  useEffect(() => {
    if (editData) {
      setForm({
        project_id: editData.project.id,
        employee_ids: editData.employees.map(e => e.id),
        from_date: formatDateForInput(editData.from_date),
        to_date: formatDateForInput(editData.to_date),
        remarks: editData.remarks
      });
    }
  }, [editData]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, empRes] = await Promise.all([
          axios.get('/projects'),
          axios.get('/employees')
        ]);

        setProjects(projectRes.data || []);
        setEmployees(empRes.data || []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEmployeeToggle = (id) => {
    setForm((prev) => {
      const updated = prev.employee_ids.includes(id)
        ? prev.employee_ids.filter((empId) => empId !== id)
        : [...prev.employee_ids, id];
      return { ...prev, employee_ids: updated };
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.project_id || form.employee_ids.length === 0 || !form.from_date || !form.to_date) {
      Swal.fire({ icon: 'warning', title: 'Warning', text: 'All fields are required', });
      return;
    }

    try {
      if (editData) {
        await axios.put(`/project-employee-maps/${editData.id}`, form);
      } else {
        await axios.post('/project-employee-maps', form);
      }
      onClose();
    } catch (err) {
      console.error('Submission failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error saving project mapping',
      });
    }
  };


  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
      <div>
        <label className="block font-medium mb-1">Project</label>
        <select
          name="project_id"
          value={form.project_id}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select Project --</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Select Employees</label>
        <div className="border p-3 rounded max-h-48 overflow-y-auto">
          {employees.length === 0 ? (
            <p className="text-sm text-gray-500">No employees available</p>
          ) : (
            employees.map((emp) => (
              <label key={emp.id} className="flex items-center space-x-2 mb-1">
                <input
                  type="checkbox"
                  checked={form.employee_ids.includes(emp.id)}
                  onChange={() => handleEmployeeToggle(emp.id)}
                />
                <span>
                  {emp.first_name} {emp.last_name} ({emp.role?.name || 'No Role'})
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">From Date</label>
          <input
            type="date"
            name="from_date"
            value={form.from_date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">To Date</label>
          <input
            type="date"
            name="to_date"
            value={form.to_date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1">Remarks</label>
        <textarea
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProjectEmployeeMapForm;
