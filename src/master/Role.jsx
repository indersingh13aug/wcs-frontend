import React, { useEffect, useState } from "react";
import axios from '../services/axios'
import Swal from "sweetalert2";
import RoleForm from "../components/Forms/RoleForm";

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchRoles = async () => {
    const res = await axios.get("/roles");
    setRoles(res.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/roles/${editing.id}`, formData);
        Swal.fire({icon: 'success',title: 'Updated!',text: "Role updated successfully.",});
      } else {
        await axios.post("/roles", formData);
        Swal.fire({icon: 'success',title: 'Created!',text: "Role created successfully.",});
      }
      fetchRoles();
      setShowForm(false);
    } catch (err) {
      Swal.fire({icon: 'error' , title: 'Created!',text : err.response?.data?.detail || "Failed to save"});
    }
  };

  const handleEdit = (role) => {
    if (role.is_deleted) return;
    setFormData(role);
    setEditing(role);
    setShowForm(true);
  };

  const handleActivate = async (id) => {
    await axios.put(`/roles/${id}/activate`);
    Swal.fire("Activated!", "Role activated successfully", "success");
    fetchRoles();
  };

  const handleDeactivate = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will deactivate the role.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
    });
    if (confirm.isConfirmed) {
      await axios.put(`/roles/${id}/deactivate`);
      Swal.fire("Deactivated!", "Role deactivated successfully", "success");
      fetchRoles();
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Roles</h1>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setEditing(null); setFormData({}); }} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Role
          </button>
        )}
      </div>

      {showForm && (
        <RoleForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
      {!showForm && (
      <table className="w-full border mt-4 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.id}>
              <td className="border p-2">{role.name}</td>
              <td className="border p-2">
                <span className={`px-2 py-1 rounded text-sm ${role.is_deleted ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                  {role.is_deleted ? "Inactive" : "Active"}
                </span>
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(role)}
                  disabled={role.is_deleted}
                  className={`px-2 py-1 rounded ${role.is_deleted ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-500 text-white"}`}
                >
                  Edit
                </button>
                {role.is_deleted ? (
                  <button onClick={() => handleActivate(role.id)} className="text-green-600 hover:underline">Activate</button>
                ) : (
                  <button onClick={() => handleDeactivate(role.id)} className="text-red-600 hover:underline">Deactivate</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
};

export default Role;
