// src/components/Forms/GSTItemForm.jsx
import React from 'react';

const GSTItemForm = ({ formData, setFormData, onSubmit, onCancel }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow space-y-4">
      <div>
        <label className="block font-medium">Item Name</label>
        <input
          type="text"
          name="item_name"
          value={formData.item_name || ''}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">HSN/SAC Code</label>
        <input
          type="text"
          name="hsn_sac"
          maxLength={8}
          value={formData.hsn_sac || ''}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block font-medium">CGST Rate (%)</label>
          <input
            type="number"
            name="cgst_rate"
            value={formData.cgst_rate || ''}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">SGST Rate (%)</label>
          <input
            type="number"
            name="sgst_rate"
            value={formData.sgst_rate || ''}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">IGST Rate (%)</label>
          <input
            type="number"
            name="igst_rate"
            value={formData.igst_rate || ''}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {formData.id ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default GSTItemForm;
