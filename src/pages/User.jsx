// src/pages/User.jsx
import React, { useEffect, useState } from "react";
import axios from "../services/axios";
import Swal from "sweetalert2";
import UserForm from "../components/Forms/UserForm";

const User = () => {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = async () => {
    const res = await axios.get("/users");
    setUsers(res.data);
  };

  const fetchEmployees = async () => {
    const res = await axios.get("/employees/availableforuser");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchEmployees();
  }, []);

  const handleAddClick = () => {
    setFormData({});
    setEditingUser(null);
    setShowForm(true);
  };

  // const handleEditClick = (user) => {
  //   if (!user.is_active) return;
  //   setFormData(user);
  //   setEditingUser(user);
  //   setShowForm(true);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
     // Alert all key-value pairs from formData
    const entries = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    alert(`Form Data:\n${entries}`);
    
    try {
      if (editingUser) {
        await axios.put(`/users/${editingUser.id}`, formData);
        Swal.fire({icon: 'success',title: 'Updated!',text: "User updated successfully",});
      } else {
        
        await axios.post("/users", formData);
        Swal.fire({icon: 'success',title: 'Created!',text: "User added successfully.",});
      }
      fetchUsers();
      setShowForm(false);
    } catch (err) {
      const msg = err.response?.data?.detail || "Save failed.";
      Swal.fire("Error", msg, "error");
      Swal.fire({icon: 'error',title: 'Error!',text: msg,});
    }
  };

  // const handleActivate = async (id) => {
  //   await axios.put(`/users/${id}/activate`);
  //   Swal.fire("Activated!", "User is now active.", "success");
  //   fetchUsers();
  // };

  // const handleDeactivate = async (id) => {
  //   const confirm = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you want to deactivate this user?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, deactivate",
  //   });

  //   if (confirm.isConfirmed) {
  //     await axios.put(`/users/${id}/deactivate`);
  //     Swal.fire("Deactivated!", "User has been deactivated.", "success");
  //     fetchUsers();
  //   }
  // };

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
          employees={employees}
          onCancel={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">User Name</th>
            <th className="border p-2">Employee</th>
            <th className="border p-2">Status</th>
            {/* <th className="border p-2">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.employee_name}</td>
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
              <td className="border p-2 space-x-2">
                {/* <button
                  onClick={() => handleEditClick(user)}
                  disabled={!user.is_active}
                  className={`px-2 py-1 rounded ${
                    user.is_active
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  Edit
                </button> */}
                {/* {user.is_active ? (
                  <button
                    onClick={() => handleDeactivate(user.id)}
                    className="text-red-600 hover:underline"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivate(user.id)}
                    className="text-green-600 hover:underline"
                  >
                    Activate
                  </button>
                )} */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;
