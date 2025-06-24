import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';

const SalesForm = ({ formData, setFormData, onChange, onSubmit, onCancel }) => {
  const [clients, setClients] = useState([]);
  const [roles, setRoles] = useState([]);
  const [services, setServices] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios.get('/clients').then(res => setClients(res.data));
    axios.get('/roles').then(res => setRoles(res.data));
    axios.get('/services').then(res => setServices(res.data));
    axios.get('/client-types').then(res => setTypes(res.data));
  }, []);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Client</label>
          <select name="client_id" value={formData.client_id || ''} onChange={onChange} className="w-full border px-3 py-2 rounded" required>
            <option value="">Select Client</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select name="role_id" value={formData.role_id || ''} onChange={onChange} className="w-full border px-3 py-2 rounded" required>
            <option value="">Select Role</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Service</label>
          <select name="service_id" value={formData.service_id || ''} onChange={onChange} className="w-full border px-3 py-2 rounded" required>
            <option value="">Select Service</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Client Type</label>
          <select name="type_id" value={formData.type_id || ''} onChange={onChange} className="w-full border px-3 py-2 rounded" required>
            <option value="">Select Type</option>
            {types.map(t => (
              <option key={t.id} value={t.id}>{t.type_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Person</label>
          <input type="text" name="contact_person" value={formData.contact_person || ''} onChange={onChange} className="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <input type="text" name="contact_number" value={formData.contact_number || ''} onChange={onChange} className="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select name="status" value={formData.status || ''} onChange={onChange} className="w-full border px-3 py-2 rounded" required>
            <option value="">Select Status</option>
            <option value="Lead">Lead</option>
            <option value="Opportunity">Opportunity</option>
            <option value="Active">Active</option>
          </select>

        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date || ''}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
};

export default SalesForm;
