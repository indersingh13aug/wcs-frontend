import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import ProjectEmployeeMapForm from '../components/Forms/ProjectEmployeeMapForm';
import Swal from 'sweetalert2';
const ProjectEmployeeMap = () => {
  const [mappings, setMappings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [yyyy, mm, dd] = dateStr.split('-');
    return `${dd}-${mm}-${yyyy}`;
  };

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
         {!showForm && (
          <button
            onClick={() => setShowForm(!showForm)} 
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Map Project
          </button>
        )}

      </div>

      {showForm && (
        <div className="mb-6">
          <ProjectEmployeeMapForm
            onClose={() => {
              setShowForm(false);
              setEditData(null);
              fetchMappings();
            }}
            editData={editData} // ✅ Add this line

          />
        </div>
      )}
{!showForm && (
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
              <tr key={record.id} className={`border-t ${records[0].is_deleted ? 'bg-red-100' : ''}`}>
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
                      {/* {record.from_date} */}
                      {formatDate(record.from_date)}
                    </td>
                    <td className="px-4 py-2" rowSpan={records.length}>
                      {/* {record.to_date} */}
                      {formatDate(record.to_date)}
                    </td>
                    <td className="px-4 py-2" rowSpan={records.length}>
                      {record.remarks}
                    </td>
                    <td className="px-4 py-2" rowSpan={records.length}>
                      <button
                        className="text-blue-600 hover:underline mr-2"
                        onClick={() => {
                          const groupEmployees = records.map(r => r.employee);
                          const first = records[0];
                          setEditData({
                            id: first.map_id || first.id, // use correct mapping ID
                            project: first.project,
                            employees: groupEmployees,
                            from_date: first.from_date,
                            to_date: first.to_date,
                            remarks: first.remarks
                          });
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="text-red-600 hover:underline"
                        onClick={async () => {
                          const first = records[0];
                          const idToUpdate = first.map_id || first.id;

                          const confirm = await Swal.fire({
                            title: `Are you sure you want to ${first.is_deleted ? 'activate' : 'deactivate'} this mapping?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Yes, proceed!'
                          });

                          if (confirm.isConfirmed) {
                            try {
                              await axios.put(`/project-employee-maps/${idToUpdate}/toggle-status`);
                              await fetchMappings(); // Refresh UI
                            } catch (err) {
                              console.error("Toggle status failed", err);
                              Swal.fire('Error', 'Failed to update status.', 'error');
                            }
                          }
                        }}
                      >
                        {records[0].is_deleted ? 'Activate' : 'Deactivate'}
                      </button>
                      <button
                        className="text-red-600 hover:underline mr-2"
                        onClick={async () => {

                          const confirm = await Swal.fire({
                            title: `Are you sure you want to permanently delete this mapping?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Yes, proceed!'
                          });

                          if (confirm.isConfirmed) {
                            try {
                              await axios.delete(`/project-employee-maps/${records[0].id}`);
                              fetchMappings();
                            } catch (err) {
                              Swal.fire('Error', 'Failed to delete mapping.', 'error');

                            }
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    )}
    </div>
  );
};

export default ProjectEmployeeMap;
