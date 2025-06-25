import axios from '../services/axios';
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PageManagerForm from "../components/Forms/PageManagerForm";

const PageManager = () => {
  const [pages, setPages] = useState([]);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);

  const fetchPages = async () => {
    try {
      const res = await axios.get('/admin/pages');
      setPages(res.data);
    } catch (err) {
      console.error('Failed to fetch pages', err);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddClick = () => {
    setFormData({});
    setEditingPage(null);
    setShowForm(true);
  };

  const handleEditClick = (page) => {
    if (page.is_deleted) return;
    setFormData(page);
    setEditingPage(page);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPage) {
        await axios.put(`/admin/pages/${editingPage.id}`, formData);
      } else {
        await axios.post('/admin/pages', formData);
      }
      setShowForm(false);
      fetchPages();
    } catch (err) {
      const message = err.response?.data?.detail || "An unexpected error occurred.";
      Swal.fire({ icon: 'error', title: 'Error', text: message });
    }
  };

  const handleActivate = async (id) => {
    try {
      await axios.put(`/admin/pages/${id}/activate`);
      Swal.fire({ icon: 'success', title: 'Activated!', text: 'Page activated successfully.' });
      fetchPages();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Activation failed.' });
    }
  };

  const handleDeactivate = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to deactivate this page?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, deactivate',
    });
    if (result.isConfirmed) {
      try {
        await axios.put(`/admin/pages/${id}/deactivate`);
        Swal.fire({ icon: 'success', title: 'Deactivated!', text: 'Page deactivated successfully.' });
        fetchPages();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Deactivation failed.' });
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Pages</h1>
        {!showForm && (
          <button onClick={handleAddClick} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Page
          </button>
        )}
      </div>

      {showForm && (
        <PageManagerForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    {!showForm && (
      <table className="w-full border mt-6 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Path</th>
            <th className="border p-2">Group</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(page => (
            <tr key={page.id}>
              <td className="border p-2">{page.name}</td>
              <td className="border p-2">{page.path}</td>
              <td className="border p-2">{page.group_name || '-'}</td>
              <td className="border p-2">
                <span className={`px-2 py-1 rounded text-sm ${page.is_deleted ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {page.is_deleted ? 'Inactive' : 'Active'}
                </span>
              </td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEditClick(page)}
                  className={`px-2 py-1 rounded ${page.is_deleted ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                  disabled={page.is_deleted}
                >
                  Edit
                </button>
                {page.is_deleted ? (
                  <button onClick={() => handleActivate(page.id)} className="text-green-600 hover:underline">
                    Activate
                  </button>
                ) : (
                  <button onClick={() => handleDeactivate(page.id)} className="text-red-600 hover:underline">
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        )}
    </div>
  );
};

export default PageManager;