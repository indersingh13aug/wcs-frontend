import React from 'react';

const RoleForm = ({ formData, onChange, onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Role Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={onChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
};

export default RoleForm;
