import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import { useAuth } from '../context/AuthContext';

const Departments = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('Failed to load departments', err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`/departments/${editingId}`, form);
      } else {
        await axios.post('/departments', form);
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
      fetchDepartments();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Operation failed');
    }
  };

  const handleEdit = (dept) => {
    setForm({ name: dept.name, description: dept.description || '' });
    setEditingId(dept.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Soft delete this department?')) return;
    try {
      await axios.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const isAdmin = user?.user?.role === 'admin';

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Departments</h2>

      {isAdmin && (
        <div className="bg-white p-4 shadow rounded mb-6 space-y-4">
          <h3 className="font-medium">{editingId ? 'Edit' : 'Add'} Department</h3>
          <input
            name="name"
            placeholder="Department Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? 'Update' : 'Create'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white shadow rounded p-4">
            <h4 className="font-bold text-lg">{dept.name}</h4>
            <p className="text-sm text-gray-500">{dept.description}</p>
            {isAdmin && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleEdit(dept)} className="text-blue-600 text-sm">Edit</button>
                <button onClick={() => handleDelete(dept.id)} className="text-red-600 text-sm">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;
