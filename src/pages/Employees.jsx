import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import EmployeeForm from '../components/Forms/EmployeeForm';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // 🔁 Track if more records exist
  const pageSize = 5;

  const fetchEmployees = async (pageNum = 1) => {
    const skip = (pageNum - 1) * pageSize;
    try {
      const res = await axios.get(`/employees?skip=${skip}&limit=${pageSize}`);
      setEmployees(res.data);
      setHasMore(res.data.length === pageSize); // ✅ If less than 10, it's the last page
    } catch (err) {
      console.error('Failed to fetch employees', err);
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEmployees(page);
  }, [page]);

  const handleAddEmployee = async (formData) => {
    try {
      await axios.post('/employees', formData);
      setShowForm(false);
      fetchEmployees(page);
    } catch (err) {
      console.error('Failed to add employee', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Employees</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-green-600 text-white px-4 py-2 rounded">
          {showForm ? 'Cancel' : 'Add Employee'}
        </button>
      </div>

      {showForm && <EmployeeForm onSubmit={handleAddEmployee} />}

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td className="px-4 py-2">{emp.first_name} {emp.last_name}</td>
                <td className="px-4 py-2">{emp.email}</td>
                <td className="px-4 py-2">{emp.department?.name || `#${emp.department_id}`}</td>
                <td className="px-4 py-2">{emp.role?.name || `#${emp.role_id}`}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 text-sm rounded font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
    </div>
  );
};

export default Employees;
