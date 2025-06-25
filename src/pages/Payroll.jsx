import React, { useEffect, useState } from 'react';
import axios from '../services/axios';

const Payroll = () => {
  const [payroll, setPayroll] = useState([]);

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const res = await axios.get('/payroll');
        setPayroll(res.data);
      } catch (err) {
        console.error('Failed to load payroll data:', err);
      }
    };

    fetchPayroll();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Payroll Records</h2>

      <div className="overflow-x-auto">
        {!showForm && (
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Employee</th>
              <th className="px-4 py-2 text-left">Month</th>
              <th className="px-4 py-2 text-left">Base Salary</th>
              <th className="px-4 py-2 text-left">HRA</th>
              <th className="px-4 py-2 text-left">Tax</th>
              <th className="px-4 py-2 text-left">Net Salary</th>
            </tr>
          </thead>
          <tbody>
            {payroll.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No payroll records available.
                </td>
              </tr>
            ) : (
              payroll.map((entry) => (
                <tr key={entry.id} className="border-t">
                  <td className="px-4 py-2">
                    {entry.first_name} {entry.last_name}
                  </td>
                  <td className="px-4 py-2">
                    {entry.month}/{entry.year}
                  </td>
                  <td className="px-4 py-2">₹{entry.base_salary}</td>
                  <td className="px-4 py-2">₹{entry.hra}</td>
                  <td className="px-4 py-2">₹{entry.tax}</td>
                  <td className="px-4 py-2 font-semibold">₹{entry.net_salary}</td>
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

export default Payroll;
