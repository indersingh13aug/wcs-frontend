import React, { useEffect, useState } from "react";
import axios from "../services/axios";
import Swal from "sweetalert2";
import UserForm from "../components/Forms/UserForm";

const User = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = async () => {
    const res = await axios.get("/users");
    setUsers(res.data);
  };

  const fetchRoles = async () => {
    const res = await axios.get("/roles");
    setRoles(res.data);
  };

  const fetchEmployeesByRole = async (roleId) => {
    const res = await axios.get(`/employees/availableforuser?role_id=${roleId}`);
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleAddClick = () => {
    setFormData({});
    setEditingUser(null);
    setEmployees([]); // reset employee dropdown
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`/users/${editingUser.id}`, formData);
        Swal.fire({ icon: "success", title: "Updated!", text: "User updated successfully" });
      } else {
        await axios.post("/users", formData);
        Swal.fire({ icon: "success", title: "Created!", text: "User added successfully." });
      }
      fetchUsers();
      setShowForm(false);
    } catch (err) {
      const msg = err.response?.data?.detail || "Save failed.";
      Swal.fire({ icon: "error", title: "Error!", text: msg });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Users</h1>
        {!showForm && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleAddClick}
          >
            Add User
          </button>
        )}
      </div>

      {showForm && (
        <UserForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          roles={roles}
          employees={employees}
          fetchEmployeesByRole={fetchEmployeesByRole}
        />
      )}
{!showForm && (
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">User Name</th>
            <th className="border p-2">Employee</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.employee_name}</td>
              <td className="border p-2">{user.role_name}</td>
              <td className="border p-2">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    user.is_active
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
)}
    </div>
  );
};

export default User;
