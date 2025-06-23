import axios from '../services/axios';
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DepartmentForm from "../components/Forms/DepartmentForm";

const Departments = () => {
  const [departments, setdepartments] = useState([]);
  const [editingdepartment, setEditingdepartment] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);

  const fetchdepartments = async () => {
    try {
      const res = await axios.get('/departments?include_deleted=true');
      setdepartments(res.data);
    } catch (err) {
      console.error('Failed to fetch departments', err);
    }
  };

  useEffect(() => {
    fetchdepartments();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddClick = () => {
    setFormData({});
    setEditingdepartment(null);
    setShowForm(true);
  };

  const handleEditClick = (department) => {
    if (department.is_deleted) return;
    setFormData(department);
    setEditingdepartment(department);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingdepartment) {
        await axios.put(`/departments/${editingdepartment.id}`, formData);
      } else {
        await axios.post('/departments', formData);
      }
      setShowForm(false);
      fetchdepartments();
    } catch (err) {
      const message =
        err.response?.data?.detail || "An unexpected error occurred.";
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
      });
      console.error('Save failed', err);
    }
  };

  const handleActivate = async (departmentId) => {
    try {
      await axios.put(`/departments/${departmentId}/activate`);
      Swal.fire({
        icon: 'success',
        title: 'Activated!',
        text: 'department has been successfully activated.',
        confirmButtonColor: '#3085d6',
      });
      fetchdepartments(); // Refresh list
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Activation failed.',
      });
      console.error(error);
    }
  };

  const handleDeactivate = async (departmentId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to deactivate this department?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, deactivate',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
      try {
        await axios.put(`/departments/${departmentId}/deactivate`);
        Swal.fire({
          icon: 'success',
          title: 'Deactivated!',
          text: 'department has been successfully deactivated.',
          confirmButtonColor: '#3085d6',
        });
        fetchdepartments(); // Refresh list
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Deactivation failed.',
        });
        console.error(error);
      }
    }
  };


  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Departments</h1>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Department
          </button>
        )}
      </div>


      {showForm && (
        <DepartmentForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table className="w-full border mt-6 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(department => (
            <tr key={department.id}>
              <td className="border p-2">{department.name}</td>
              <td className="border p-2">{department.description}</td>
              <td className="border p-2">
                <span className={`px-2 py-1 rounded text-sm ${department.is_deleted ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {department.is_deleted ? 'Inactive' : 'Active'}
                </span>
              </td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEditClick(department)}
                  className={`px-2 py-1 rounded ${department.is_deleted ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                  disabled={department.is_deleted}
                >
                  Edit
                </button>
                {department.is_deleted ? (
                  <button onClick={() => handleActivate(department.id)} className="text-green-600 hover:underline">
                    Activate
                  </button>
                ) : (
                  <button onClick={() => handleDeactivate(department.id)} className="text-red-600 hover:underline">
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Departments;
