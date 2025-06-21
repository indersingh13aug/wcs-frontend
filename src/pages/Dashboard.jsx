import React, { useEffect, useState } from 'react';
import axios from '../services/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    pendingLeaves: 0,
    payrollEntries: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/stats');

        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Welcome to HRMS Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Employees</p>
          <h3 className="text-2xl font-semibold">{stats.employees}</h3>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Departments</p>
          <h3 className="text-2xl font-semibold">{stats.departments}</h3>
        </div>

        {/* <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Pending Leave Requests</p>
          <h3 className="text-2xl font-semibold">{stats.pendingLeaves}</h3>
        </div> */}

        {/* <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Payroll Records</p>
          <h3 className="text-2xl font-semibold">{stats.payrollEntries}</h3>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
