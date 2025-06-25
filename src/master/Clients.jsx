// src/pages/Client.jsx
import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import ClientForm from '../components/Forms/ClientForm';
import Swal from 'sweetalert2';

const Client = () => {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const fetchClients = async () => {
    
    try {
      const res = await axios.get('/clients');
      setClients(res.data);
    } catch (err) {
      console.error('Failed to fetch clients', err);
    }
  };

  useEffect(() => {
    const fetchDropdowns = async () => {
    try {
      const [countryRes, indiaStates] = await Promise.all([
      axios.get('/countries'),
      axios.get('/states?country_code=IN'),
    ]);
    setCountries(countryRes.data);
    setStates(indiaStates.data);
    } catch (err) {
      console.error("Failed to load country/state dropdowns", err);
    }
  };
  
    fetchClients();
    fetchDropdowns(); 
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddClick = () => {
    setFormData({});
    setEditingClient(null);
    setShowForm(true);
  };

  const handleEditClick = (client) => {
    if (client.is_deleted) return;
    setFormData(client);
    setEditingClient(client);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await axios.put(`/clients/${editingClient.id}`, formData);
      } else {
        await axios.post('/clients', formData);
      }
      setShowForm(false);
      fetchClients();
    } catch (err) {
      const message =
        err.response?.data?.detail || "An unexpected error occurred.";
      Swal.fire({icon: 'error',title: 'Error',text: message,});
      console.error('Save failed', err);
    }
  };

  const handleActivate = async (clientId) => {
    try {
      await axios.put(`/clients/${clientId}/activate`);
      Swal.fire({
        icon: 'success',
        title: 'Activated!',
        text: 'Client has been successfully activated.',
        confirmButtonColor: '#3085d6',
      });
      fetchClients(); // Refresh list
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Activation failed.',
      });
      console.error(error);
    }
  };

  const handleDeactivate = async (clientId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to deactivate this client?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, deactivate',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
      try {
        await axios.put(`/clients/${clientId}/deactivate`);
        Swal.fire({
          icon: 'success',
          title: 'Deactivated!',
          text: 'Client has been successfully deactivated.',
          confirmButtonColor: '#3085d6',
        });
        fetchClients(); // Refresh list
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Deactivation failed.',
        });
        console.error(error);
      }
    }
  };


  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Clients</h1>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Client
          </button>
        )}
      </div>


      {showForm && (
        <ClientForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          countries={countries}
          states={states}
        />
      )}
  {!showForm && (
      <table className="w-full border mt-6 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Client Code</th>
            <th className="border p-2">Contact Person</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">GST</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td className="border p-2">{client.name}</td>
              <td className="border p-2">{client.client_code}</td>
              <td className="border p-2">{client.contact_person}</td>
              <td className="border p-2">{client.email}</td>
              <td className="border p-2">{client.phone}</td>

              <td className="border p-2">
                {[client.addressline1, client.addressline2, client.state, client.country, client.pincode]
                  .filter(Boolean)
                  .join(', ')}
              </td>


              <td className="border p-2">{client.gst_number}</td>
              <td className="border p-2">
                <span className={`px-2 py-1 rounded text-sm ${client.is_deleted ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {client.is_deleted ? 'Inactive' : 'Active'}
                </span>
              </td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEditClick(client)}
                  className={`px-2 py-1 rounded ${client.is_deleted ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                  disabled={client.is_deleted}
                >
                  Edit
                </button>
                {client.is_deleted ? (
                  <button onClick={() => handleActivate(client.id)} className="text-green-600 hover:underline">
                    Activate
                  </button>
                ) : (
                  <button onClick={() => handleDeactivate(client.id)} className="text-red-600 hover:underline">
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

export default Client;
