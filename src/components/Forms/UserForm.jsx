import React, { useEffect, useState } from "react";
import axios from "../../services/axios";

const UserForm = ({ formData, setFormData, roles, employees, onSubmit, onCancel }) => {
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    if (formData.role_id) {
      fetchEmployeesByRole(formData.role_id);
    } else {
      setFilteredEmployees([]);
    }
  }, [formData.role_id]);

  const fetchEmployeesByRole = async (roleId) => {
    try {
      const res = await axios.get(`/employees/availableforuser?role_id=${roleId}`);
      setFilteredEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "employee_id" || name === "role_id" ? Number(value) : value;

    let updatedForm = { ...formData, [name]: newValue };

    if (name === "employee_id") {
      const emp = filteredEmployees.find((e) => e.id === Number(value));
      if (emp) {
        updatedForm.username = `${emp.id}_${emp.full_name.replace(/\s+/g, "_").slice(0, 5).toLowerCase()}`;
      }
    }

    setFormData(updatedForm);
  };

  return (
    <div className="bg-white p-6 border rounded shadow-md mt-6">
      <h2 className="text-lg font-bold mb-4">
        {formData.id ? "Edit User" : "Add User"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Role Dropdown */}
        <div>
          <label className="block font-medium">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="role_id"
            value={formData.role_id || ""}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
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
            disabled={!formData.role_id}
          >
            <option value="">-- Select Employee --</option>
            {filteredEmployees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Username - Auto Generated */}
        <div>
          <label className="block font-medium">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username || ""}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
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