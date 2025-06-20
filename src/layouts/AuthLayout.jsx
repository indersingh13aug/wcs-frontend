import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome to WCA HRMS</h1>
          <p className="text-sm text-gray-500">Please log in to continue</p>
        </div>
        <Outlet /> {/* This renders the <LoginPage /> component */}
      </div>
    </div>
  );
};

export default AuthLayout;
