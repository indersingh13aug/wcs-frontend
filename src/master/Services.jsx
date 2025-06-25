import React, { useEffect, useState } from "react";
import axios from '../services/axios'
import Swal from "sweetalert2";
import ServicesForm from "../components/Forms/ServicesForm";

const Services = () => {
  const [services, setservices] = useState([]);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchservices = async () => {
    const res = await axios.get("/services");
    setservices(res.data);
  };

  useEffect(() => {
    fetchservices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/services/${editing.id}`, formData);
        Swal.fire({icon: 'success',title: 'Updated!',text: "Service updated successfully.",});
      } else {
        await axios.post("/services", formData);
        Swal.fire({icon: 'success',title: 'Created!',text: "Service created successfully.",});
      }
      fetchservices();
      setShowForm(false);
    } catch (err) {
      Swal.fire({icon: 'error' , title: 'Created!',text : err.response?.data?.detail || "Failed to save"});
    }
  };

  const handleEdit = (Services) => {
    if (Services.is_deleted) return;
    setFormData(Services);
    setEditing(Services);
    setShowForm(true);
  };

  const handleActivate = async (id) => {
    await axios.put(`/services/${id}/activate`);
    Swal.fire("Activated!", "Services activated successfully", "success");
    fetchservices();
  };

  const handleDeactivate = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will deactivate the Service.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
    });
    if (confirm.isConfirmed) {
      await axios.put(`/services/${id}/deactivate`);
      Swal.fire("Deactivated!", "Service deactivated successfully", "success");
      fetchservices();
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Services</h1>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setEditing(null); setFormData({}); }} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Services
          </button>
        )}
      </div>

      {showForm && (
        <ServicesForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
{!showForm && (
      <table className="w-full border mt-4 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.id}>
              <td className="border p-2">{service.name}</td>
              <td className="border p-2">
                <span className={`px-2 py-1 rounded text-sm ${service.is_deleted ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                  {service.is_deleted ? "Inactive" : "Active"}
                </span>
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(service)}
                  disabled={service.is_deleted}
                  className={`px-2 py-1 rounded ${service.is_deleted ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-500 text-white"}`}
                >
                  Edit
                </button>
                {service.is_deleted ? (
                  <button onClick={() => handleActivate(service.id)} className="text-green-600 hover:underline">Activate</button>
                ) : (
                  <button onClick={() => handleDeactivate(service.id)} className="text-red-600 hover:underline">Deactivate</button>
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

export default Services;
