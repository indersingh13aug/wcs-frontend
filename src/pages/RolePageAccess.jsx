import React, { useEffect, useState } from 'react';
import axios from '../services/axios';

const RolePageAccess = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(1);
  const [pages, setPages] = useState([]);
  const [access, setAccess] = useState([]);

  useEffect(() => {
    axios.get("/roles").then((res) => setRoles(res.data));
    fetchPages();
  }, []);

  useEffect(() => {
    fetchAccess();
  }, [selectedRole]);

  const fetchPages = async () => {
    const res = await axios.get('/pages');
    setPages(res.data);
  };

  const fetchAccess = async () => {
    const res = await axios.get(`/access/${selectedRole}`);
    setAccess(res.data);
  };

  const toggleAccess = (pageId) => {
    setAccess((prev) =>
      prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]
    );
  };

  const saveAccess = async () => {
    await axios.put('/access', { role_id: selectedRole, page_ids: access });
    alert('Access updated');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Role Page Access</h2>

      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(Number(e.target.value))}
        className="border p-2 mb-4"
      >
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

      <div className="space-y-2">
        {pages.map((page) => (
          <label key={page.id} className="block">
            <input
              type="checkbox"
              checked={access.includes(page.id)}
              onChange={() => toggleAccess(page.id)}
              className="mr-2"
            />
            {page.name} ({page.path})
          </label>
        ))}
      </div>

      <button
        onClick={saveAccess}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Access
      </button>
    </div>
  );
};

export default RolePageAccess;
