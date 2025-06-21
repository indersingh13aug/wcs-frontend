// src/pages/ClientForm.jsx
import React from 'react';

const ClientForm = ({ formData, onChange, onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {['name', 'contact_person', 'email', 'phone', 'address', 'gst_number'].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium mb-1 capitalize">
            {field.replace('_', ' ')}
          </label>
          <input
            type="text"
            name={field}
            value={formData[field] || ''}
            onChange={onChange}
            required={['name', 'email'].includes(field)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      ))}
      <div className="flex gap-3">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
};

export default ClientForm;
