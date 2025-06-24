import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import Swal from 'sweetalert2';

const RolePageAccess = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [pages, setPages] = useState([]);
  const [access, setAccess] = useState([]);

  useEffect(() => {
    axios.get("/roles").then((res) => setRoles(res.data));
    fetchPages();
  }, []);

  useEffect(() => {
    if (selectedRole) fetchAccess();
  }, [selectedRole]);

  const fetchPages = async () => {
    const res = await axios.get('/admin/pages');
    setPages(res.data);
  };

  const fetchAccess = async () => {
    const res = await axios.get(`/admin/access/${selectedRole}`);
    setAccess(res.data);
  };

  const toggleAccess = (pageId) => {
    setAccess((prev) =>
      prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]
    );
  };

  const saveAccess = async () => {
    await axios.put('/admin/access', { role_id: selectedRole, page_ids: access });
    Swal.fire({
      icon: 'success',
      title: 'Access Updated',
      text: 'Page access updated successfully!',
      confirmButtonColor: '#3085d6',
    });
  };

  // Group pages by group_name
  const groupedPages = pages.reduce((acc, page) => {
    const group = page.group_name || 'Ungrouped';
    if (!acc[group]) acc[group] = [];
    acc[group].push(page);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Role Page Access</h2>

      <div className="flex items-center gap-4">
        <label className="font-medium">Select Role:</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        >
          <option disabled value="">-- Select Role --</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {selectedRole && (
        <>
          <p className="text-sm text-gray-600">
            Selected {access.length} of {pages.length} pages
          </p>

          {Object.entries(groupedPages).map(([group, groupPages]) => (
            <div key={group} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{group}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {groupPages.map((page) => (
                  <label
                    key={page.id}
                    htmlFor={`page-${page.id}`}
                    className="flex items-center gap-2 border px-3 py-2 rounded cursor-pointer"
                  >
                    <input
                      id={`page-${page.id}`}
                      type="checkbox"
                      checked={access.includes(page.id)}
                      onChange={() => toggleAccess(page.id)}
                    />
                    <span>{page.name} ({page.path})</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={saveAccess}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Access
          </button>
        </>
      )}
    </div>
  );
};

export default RolePageAccess;
