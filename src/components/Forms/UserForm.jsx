import React from "react";

const UserForm = ({ formData, setFormData, employees, onSubmit, onCancel }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "employee_id" ? Number(value) : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <div className="bg-white p-6 border rounded shadow-md mt-6">
      <h2 className="text-lg font-bold mb-4">
        {formData.id ? "Edit User" : "Add User"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block font-medium">
            User Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username || ""}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Employee Dropdown */}
        <div>
          <label className="block font-medium">
            Employee <span className="text-red-500">*</span>
          </label>
          <select
            name="employee_id"
            value={formData.employee_id || ""}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {formData.id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
