import React, { useEffect, useState } from 'react';
import axios from '../services/axios';

const ProjectEmployeeMap = () => {
  const [grouped, setGrouped] = useState({});

  const fetchData = async () => {
    const res = await axios.get('/project-employee-maps');

    const groupedData = res.data.reduce((acc, row) => {
      const key = row.project_id;
      if (!acc[key]) {
        acc[key] = {
          project_name: row.project_name,
          employees: []
        };
      }
      acc[key].employees.push({
        name: row.employee_name,
        role: row.role_name,
        ro: row.ro_name
      });
      return acc;
    }, {});
    setGrouped(groupedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Project Employee Mappings</h1>

      <table className="w-full border text-sm bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Sr. No.</th>
            <th className="border px-4 py-2">Project Name</th>
            <th className="border px-4 py-2">Employee Names</th>
            <th className="border px-4 py-2">Roles</th>
            <th className="border px-4 py-2">RO Names</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grouped).map(([projId, group], idx) => {
            const empNames = group.employees.map(e => e.name).join(', ');
            const roles = group.employees.map(e => e.role).join(', ');
            const ros = group.employees.map(e => e.ro).join(', ');

            return (
              <tr key={projId}>
                <td className="border px-4 py-2">{idx + 1}</td>
                <td className="border px-4 py-2">{group.project_name}</td>
                <td className="border px-4 py-2">{empNames}</td>
                <td className="border px-4 py-2">{roles}</td>
                <td className="border px-4 py-2">{ros}</td>
                <td className="border px-4 py-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm mr-2">Edit</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded text-sm">Deactivate</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectEmployeeMap;
