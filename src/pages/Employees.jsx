import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import EmployeeForm from '../components/Forms/EmployeeForm';


const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 5;

  const fetchEmployees = async (pageNum = 1) => {
    const skip = (pageNum - 1) * pageSize;
    try {
      const res = await axios.get(`/employees?skip=${skip}&limit=${pageSize}`);
      setEmployees(res.data);
      setHasMore(res.data.length === pageSize);
    } catch (err) {
      console.error('Failed to fetch employees', err);
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEmployees(page);
  }, [page]);

  const handleAddOrUpdateEmployee = async (formData) => {
    try {
      if (editingEmployee) {
        await axios.put(`/employees/${editingEmployee.id}`, formData);
      } else {
        await axios.post('/employees', formData);
      }
      setShowForm(false);
      setEditingEmployee(null);
      fetchEmployees(page);
    } catch (err) {
      console.error('Failed to save employee', err);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Employees</h2>
        {!showForm && (
          <button
            onClick={() => {
              setEditingEmployee(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Employee
          </button>
        )}
      </div>

      {showForm && (
        <EmployeeForm
          onSubmit={handleAddOrUpdateEmployee}
          onCancel={() => {
            setShowForm(false);
            setEditingEmployee(null);
          }}
          employee={editingEmployee}
        />
      )}

      <div className="overflow-x-auto mt-6">
        {!showForm && (
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-t">
                  <td className="px-4 py-2">{emp.first_name} {emp.last_name}</td>
                  <td className="px-4 py-2">{emp.email}</td>
                  <td className="px-4 py-2">{emp.department?.name || `#${emp.department_id}`}</td>
                  <td>{emp.role?.name || "No Role Assigned"}</td>
                  <td className="px-4 py-2">
                    <span
                  className={`px-2 py-1 rounded text-sm ${
                    emp.status
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {emp.status ? "Active" : "Inactive"}
                </span>
                      
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className={`px-2 py-1 rounded ${emp.is_deleted ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                      onClick={() => handleEdit(emp)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!showForm && (
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded bg-gray-200"
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="font-medium">Page {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded bg-gray-200"
            disabled={!hasMore}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Employees;
