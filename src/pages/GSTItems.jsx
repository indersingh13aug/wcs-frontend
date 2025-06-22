import React, { useEffect, useState } from 'react';
import GSTItemForm from '../components/Forms/GSTItemForm';
import Swal from 'sweetalert2';
import axios from '../services/axios';

const GSTItems = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchItems = async () => {
    const res = await axios.get('/gst-items'); // adjust endpoint
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item) => {
    setFormData(item);
    setEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/gst-items/${formData.id}`, formData);
        Swal.fire('Updated!', 'GST Item updated successfully.', 'success');
      } else {
        await axios.post('/gst-items', formData);
        Swal.fire('Created!', 'GST Item added successfully.', 'success');
      }
      fetchItems();
      setShowForm(false);
      setFormData({});
      setEditing(false);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.detail || 'Save failed.', 'error');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({});
    setEditing(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">GST Items</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add GST Item
          </button>
        )}
      </div>

      {showForm && (
        <GSTItemForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <table className="w-full border text-sm mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Item</th>
            <th className="border p-2">HSN/SAC</th>
            <th className="border p-2">CGST Rate (%)</th>
            <th className="border p-2">SGST Rate (%)</th>
            <th className="border p-2">IGST Rate (%)</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.item_name}</td>
              <td className="border p-2">{item.hsn_sac}</td>
              <td className="border p-2">{Number(item.cgst_rate).toFixed(2)}</td>
              <td className="border p-2">{Number(item.sgst_rate).toFixed(2)}</td>
              <td className="border p-2">{Number(item.igst_rate).toFixed(2)}</td>
              <td className="border p-2">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    item.is_deleted
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {item.is_deleted ? "Inactive" : "Active"}
                </span>
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GSTItems;
