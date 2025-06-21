import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import { useAuth } from '../context/AuthContext';

const Clients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ name: '', contact_email: '', contact_person: '' });
  const [editingId, setEditingId] = useState(null);

  const isAdmin = user?.user?.role === 'admin';

  const fetchClients = async () => {
    try {
      const res = await axios.get('/api/clients');
      setClients(res.data);
    } catch (err) {
      console.error('Failed to load clients', err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`/api/clients/${editingId}`, form);
      } else {
        await axios.post('/api/clients', form);
      }
      setForm({ name: '', contact_email: '', contact_person: '' });
      setEditingId(null);
      fetchClients();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Operation failed');
    }
  };

  const handleEdit = (client) => {
    setForm({
      name: client.name,
      contact_email: client.contact_email,
      contact_person: client.contact_person
    });
    setEditingId(client.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Soft delete this client?')) return;
    try {
      await axios.delete(`/api/clients/${id}`);
      fetchClients();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Clients</h2>

      {isAdmin && (
        <div className="bg-white p-4 shadow rounded mb-6 space-y-4">
          <h3 className="font-medium">{editingId ? 'Edit Client' : 'Add Client'}</h3>
          <input
            name="name"
            placeholder="Client Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="contact_person"
            placeholder="Contact Person"
            value={form.contact_person}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="contact_email"
            placeholder="Contact Email"
            type="email"
            value={form.contact_email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? 'Update' : 'Create'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <div key={client.id} className="bg-white shadow rounded p-4">
            <h4 className="font-bold text-lg">{client.name}</h4>
            <p className="text-sm text-gray-600">Contact: {client.contact_person}</p>
            <p className="text-sm text-gray-600">Email: {client.contact_email}</p>
            {isAdmin && (
              <div className="flex gap-3 mt-3">
                <button onClick={() => handleEdit(client)} className="text-blue-600 text-sm">Edit</button>
                <button onClick={() => handleDelete(client.id)} className="text-red-600 text-sm">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;
