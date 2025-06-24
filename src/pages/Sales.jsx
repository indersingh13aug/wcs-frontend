import axios from '../services/axios';
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import SalesForm from "../components/Forms/SalesForm";

const Sales = () => {
  const [salesList, setSalesList] = useState([]);
  const [editingSale, setEditingSale] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);

  const fetchSales = async () => {
    try {
      const res = await axios.get('/sales');
      setSalesList(res.data);
    } catch (err) {
      console.error('Failed to fetch sales records', err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddClick = () => {
    setFormData({});
    setEditingSale(null);
    setShowForm(true);
  };

  const handleEditClick = (sale) => {
    if (sale.is_deleted) return;
    setFormData(sale);
    setEditingSale(sale);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSale) {
        await axios.put(`/sales/${editingSale.id}`, formData);
      } else {
        await axios.post('/sales', formData);
      }
      setShowForm(false);
      fetchSales();
    } catch (err) {
      const message =
        err.response?.data?.detail || "An unexpected error occurred.";
      Swal.fire({ icon: 'error', title: 'Error', text: message });
    }
  };

  const handleActivate = async (id) => {
    try {
      await axios.put(`/sales/${id}/activate`);
      Swal.fire({
        icon: 'success',
        title: 'Activated!',
        text: 'Sales record has been activated.',
      });
      fetchSales();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Activation failed.' });
    }
  };

  const handleDeactivate = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to deactivate this sales record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactivate',
    });
    if (result.isConfirmed) {
      try {
        await axios.put(`/sales/${id}/deactivate`);
        Swal.fire({ icon: 'success', title: 'Deactivated!' });
        fetchSales();
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Deactivation failed.' });
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Sales</h1>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Sale
          </button>
        )}
      </div>

      {showForm && (
        <SalesForm
          formData={formData}
          setFormData={setFormData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table className="w-full border mt-6 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Client</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Service</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Contact Person</th>
            <th className="border p-2">Contact No</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Track Status</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {salesList.map(sale => (
            <tr key={sale.id}>
              <td className="border p-2">{sale.client_name || sale.client_id}</td>
              <td className="border p-2">{sale.role_name || sale.role_id}</td>
              <td className="border p-2">{sale.service_name || sale.service_id}</td>
              <td className="border p-2">{sale.type_name || sale.type_id}</td>
              <td className="border p-2">{sale.contact_person}</td>
              <td className="border p-2">{sale.contact_number}</td>
              <td className="border p-2">{sale.date}</td>
              <td className="border p-2">{sale.status}</td>
              <td className="border p-2">
                <span className={`px-2 py-1 rounded text-sm ${sale.is_deleted ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {sale.is_deleted ? 'Inactive' : 'Active'}
                </span>
              </td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEditClick(sale)}
                  className={`px-2 py-1 rounded ${sale.is_deleted ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                  disabled={sale.is_deleted}
                >
                  Edit
                </button>
                {sale.is_deleted ? (
                  <button onClick={() => handleActivate(sale.id)} className="text-green-600 hover:underline">
                    Activate
                  </button>
                ) : (
                  <button onClick={() => handleDeactivate(sale.id)} className="text-red-600 hover:underline">
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;
