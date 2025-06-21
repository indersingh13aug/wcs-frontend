// src/components/Forms/ProjectForm.jsx
import React from "react";

const ProjectForm = ({ formData, setFormData, clients, employees, onSubmit, onCancel }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (id) => {
    const team = formData.assigned_team || [];
    const updatedTeam = team.includes(id)
      ? team.filter((memberId) => memberId !== id)
      : [...team, id];
    setFormData((prev) => ({
      ...prev,
      assigned_team: updatedTeam,
    }));
  };

  return (
    <div className="bg-white p-6 border rounded shadow-md mt-6">
      <h2 className="text-lg font-bold mb-4">
        {formData.id ? "Edit Project" : "Add Project"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows="3"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Client Dropdown */}
        <div>
          <label className="block font-medium">Client <span className="text-red-500">*</span></label>
          <select
            name="client_id"
            value={formData.client_id || ""}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select Client --</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assigned Team (Checkbox List) */}
        <div>
          <label className="block font-medium mb-2">Assigned Team</label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
            {employees.map((emp) => (
              <label key={emp.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={emp.id}
                  checked={(formData.assigned_team || []).includes(emp.id)}
                  onChange={() => handleCheckboxChange(emp.id)}
                />
                {emp.full_name}
              </label>
            ))}
          </div>
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

export default ProjectForm;
