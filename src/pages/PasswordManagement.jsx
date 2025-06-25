import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
const Profile = () => {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  
  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      Swal.fire({icon: 'error',title: 'Error',text: 'Passwords do not match',});
      return;
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold">Password Management</h1>
        <div className="bg-white shadow rounded p-6">
          {/* Password Change */}
          <div className="bg-white shadow rounded p-6">
            <h2 className="text-lg font-medium mb-4">Change Password</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Current Password" name="current" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} type="password" />
              <Input label="New Password" name="new" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} type="password" />
              <Input label="Confirm Password" name="confirm" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} type="password" />
            </div>
            <button onClick={handlePasswordChange} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">
              Update Password
            </button>
          </div>
        </div>
    </div>
  );
};

const Input = ({ label, ...rest }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...rest}
    />
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default Profile;
