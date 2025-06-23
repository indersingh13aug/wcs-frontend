import React, { useEffect, useState } from 'react';

const ClientForm = ({
  formData,
  onChange,       // setFormData from parent
  onSubmit,
  onCancel,
  countries = [],
  states = []
}) => {
  const [showStateDropdown, setShowStateDropdown] = useState(formData.country === 'IN');

  useEffect(() => {
    setShowStateDropdown(formData.country === 'IN');
  }, [formData.country]);

  const handleInputChange = (e) => {
    onChange(e);
  };

  const handleCountryChange = (e) => {
    onChange(e); // also triggers re-fetch of states in parent if needed
  };



  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent full page reload
    onSubmit(e);        // Call parent submit
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Basic fields */}
      {['name', 'client_code', 'contact_person', 'email', 'phone', 'gst_number'].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium mb-1 capitalize">
            {field.replace('_', ' ')}
          </label>
          <input
            type="text"
            name={field}
            value={formData[field] || ''}
            onChange={handleInputChange}
            required={['name', 'email'].includes(field)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      ))}

      {/* Address line 1 */}
      <div>
        <label className="block text-sm font-medium mb-1">Address Line 1</label>
        <input
          type="text"
          name="addressline1"
          value={formData.addressline1 || ''}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Address line 2 */}
      <div>
        <label className="block text-sm font-medium mb-1">Address Line 2</label>
        <input
          type="text"
          name="addressline2"
          value={formData.addressline2 || ''}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Country dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">Country</label>
        <select
          name="country"
          value={formData.country || ''}
          onChange={handleCountryChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* State dropdown (for India) or input (for others) */}
      <div>
        <label className="block text-sm font-medium mb-1">State</label>
        {showStateDropdown ? (
          <select
            name="state"
            value={formData.state || ''}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name="state"
            value={formData.state || ''}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter State"
          />
        )}
      </div>

      {/* Pincode */}
      <div>
        <label className="block text-sm font-medium mb-1">Pin Code</label>
        <input
          type="text"
          name="pincode"
          maxLength={6}
          value={formData.pincode || ''}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Address preview */}
      <div className="bg-gray-100 p-4 rounded border">
        <p className="font-semibold mb-2">📍 Address Preview</p>
        <p>{formData.addressline1}</p>
        <p>{formData.addressline2}</p>
        <p>
          {formData.state}, {formData.country} - {formData.pincode}
        </p>
      </div>

      {/* Form actions */}
      <div className="flex gap-3">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
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

export default ClientForm;
