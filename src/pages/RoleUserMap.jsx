import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import Swal from 'sweetalert2';

const RoleUserMap = () => {
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    axios.get('/roles').then(res => setRoles(res.data));

    axios.get("/role-user/employees").then((res) => {
      setEmployees(res.data); // response: [{ id, full_name, role_ids }]
    });
  }, []);

  useEffect(() => {
  if (selectedRole) {
    axios.get(`/role-user/employees?selected_role=${selectedRole}`)
      .then((res) => {
        setEmployees(res.data);
        const selected = res.data
          .filter(emp => emp.is_selected)
          .map(emp => emp.id);
        setSelectedEmployees(selected);
      });
  }
}, [selectedRole]);

  const handleCheckboxChange = (empId) => {
    setSelectedEmployees((prev) =>
      prev.includes(empId)
        ? prev.filter((id) => id !== empId)
        : [...prev, empId]
    );
  };

  const handleSave = async () => {
    await axios.put("/role-user/assign", {
      role_id: selectedRole,
      employee_ids: selectedEmployees,
    });

    Swal.fire({
      icon: 'success',
      title: 'Role Updated',
      text: 'User-Role mapping saved.',
      confirmButtonColor: '#3085d6',
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Assign Role to Employees</h1>

      <select
        className="border px-3 py-2 rounded w-full"
        value={selectedRole}
        onChange={(e) => setSelectedRole(Number(e.target.value))}
      >
        <option value="">-- Select Role --</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>

      {selectedRole && (
        <div className="bg-white border rounded p-4 mt-4">
          <p className="font-semibold mb-2">Select Employees:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {employees.map((emp) => (
              <label key={emp.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedEmployees.includes(emp.id)}
                  onChange={() => handleCheckboxChange(emp.id)}
                />
                {emp.full_name}
              </label>
            ))}
          </div>
        </div>
      )}

      {selectedRole && (
        <button
          onClick={handleSave}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Mapping
        </button>
      )}
    </div>
  );
};

export default RoleUserMap;
