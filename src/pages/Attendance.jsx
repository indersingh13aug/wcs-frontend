import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import Breadcrumbs from '../components/Breadcrumbs';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get('/attendance');
        setAttendance(res.data);
      } catch (err) {
        console.error('Failed to load attendance data:', err);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div>
      <Breadcrumbs customLabels={{ '/attendance': 'Attendance' }} />
      <h2 className="text-2xl font-bold mb-4">Attendance Records</h2>

      <div className="overflow-x-auto">
        {!showForm && (
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Employee</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Clock In</th>
              <th className="px-4 py-2 text-left">Clock Out</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              attendance.map((record) => (
                <tr key={record.id} className="border-t">
                  <td className="px-4 py-2">
                    {record.first_name} {record.last_name}
                  </td>
                  <td className="px-4 py-2">{record.date}</td>
                  <td className="px-4 py-2">{record.clock_in}</td>
                  <td className="px-4 py-2">{record.clock_out}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default Attendance;
