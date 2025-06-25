import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import { useAuth } from '../../context/AuthContext';

const EmployeeForm = ({ onSubmit, onCancel, employee = null }) => {
  const [form, setForm] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    department_id: '',
    role_id: '',
    date_of_joining: '',
    status: 'Active'
  });

  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  // Prefill form when editing
  useEffect(() => {
    if (employee) {
      setForm({
        first_name: employee.first_name || '',
        middle_name: employee.middle_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        department_id: String(employee.department_id) || '',
        role_id: String(employee.role_id) || '',
        date_of_joining: employee.date_of_joining || '',
        status: employee.status || 'Active'
      });
    }
  }, [employee]);

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const deptRes = await axios.get('/departments');
        const roleRes = await axios.get('/roles');
        setDepartments(deptRes.data);
        setRoles(roleRes.data);
      } catch (err) {
        console.error('Failed to load dropdown data', err);
      }
    };

    fetchMetaData();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      department_id: parseInt(form.department_id),
      role_id: parseInt(form.role_id),
      user_id: user?.id
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow max-w-3xl"
    >
      <span className="text-sm text-gray-600">First Name</span>
      <input
        type="text"
        name="first_name"
        value={form.first_name}
        onChange={handleChange}
        placeholder="First Name"
        className="input"
        required
      />

      <span className="text-sm text-gray-600">Middle Name</span>
      <input
        type="text"
        name="middle_name"
        value={form.middle_name}
        onChange={handleChange}
        placeholder="Middle Name"
        className="input"
        required
      />

      <span className="text-sm text-gray-600">Last Name</span>
      <input
        type="text"
        name="last_name"
        value={form.last_name}
        onChange={handleChange}
        placeholder="Last Name"
        className="input"
        required
      />

      <span className="text-sm text-gray-600">Email</span>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="input"
        required
      />

      <span className="text-sm text-gray-600">Role</span>
      <select
        name="role_id"
        value={form.role_id}
        onChange={handleChange}
        className="input"
        required
      >
        <option value="">Select Role</option>
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

      <span className="text-sm text-gray-600">Department</span>
      <select
        name="department_id"
        value={form.department_id}
        onChange={handleChange}
        className="input"
        required
      >
        <option value="">Select Department</option>
        {departments.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <label className="col-span-2">
        <span className="text-sm text-gray-600">Date of Joining</span>
        <input
          type="date"
          name="date_of_joining"
          value={form.date_of_joining}
          onChange={handleChange}
          className="input w-full"
          required
        />
      </label>

      <label className="col-span-2">
        <span className="text-sm text-gray-600">Status</span>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="input w-full"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </label>

      <div className="flex gap-3 col-span-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {employee ? 'Update' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
