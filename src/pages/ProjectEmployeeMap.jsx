import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import ProjectEmployeeMapForm from '../components/Forms/ProjectEmployeeMapForm';

const ProjectEmployeeMap = () => {
  const [mappings, setMappings] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchMappings = async () => {
    try {
      const res = await axios.get('/project-employee-maps');
      setMappings(res.data);
    } catch (err) {
      console.error('Error fetching project-employee mappings', err);
    }
  };

  useEffect(() => {
    fetchMappings();
  }, []);

  const groupedData = mappings.reduce((acc, map) => {
    const key = `${map.project.id}_${map.from_date}_${map.to_date}_${map.remarks}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(map);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Project Employee Mappings</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Map Project
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <ProjectEmployeeMapForm
            onClose={() => {
              setShowForm(false);
              fetchMappings();
            }}
          />
        </div>
      )}

      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Sr. No.</th>
            <th className="px-4 py-2">Project Name</th>
            <th className="px-4 py-2">Employee Name</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">RO Name</th>
            <th className="px-4 py-2">From Date</th>
            <th className="px-4 py-2">To Date</th>
            <th className="px-4 py-2">Remarks</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedData).map(([groupKey, records], groupIndex) =>
            records.map((record, idx) => (
              <tr key={record.id} className="border-t">
                {idx === 0 && (
                  <td className="px-4 py-2" rowSpan={records.length}>
                    {groupIndex + 1}
                  </td>
                )}
                {idx === 0 && (
                  <td className="px-4 py-2" rowSpan={records.length}>
                    {record.project.name}
                  </td>
                )}
                <td className="px-4 py-2">
                  {record.employee.first_name} {record.employee.last_name}
                </td>
                <td className="px-4 py-2">{record.employee.role?.name || '-'}</td>
                <td className="px-4 py-2">{record.employee.ro_name}</td>
                {idx === 0 && (
                  <>
                    <td className="px-4 py-2" rowSpan={records.length}>
                      {record.from_date}
                    </td>
                    <td className="px-4 py-2" rowSpan={records.length}>
                      {record.to_date}
                    </td>
                    <td className="px-4 py-2" rowSpan={records.length}>
                      {record.remarks}
                    </td>
                    <td className="px-4 py-2" rowSpan={records.length}>
                      <button className="text-blue-600 hover:underline mr-2">Edit</button>
                      {/* <button className="text-red-600 hover:underline">
                        {record.is_deleted ? 'Activate' : 'Deactivate'}
                      </button> */}
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectEmployeeMap;
