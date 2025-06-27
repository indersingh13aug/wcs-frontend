import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
const personal = () => {
  const [activeTab, setActiveTab] = useState('personal');  // 'personal' | 'password'
  const [personal, setpersonal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const { user } = useAuth();
  // console.log("Logged-in user from context:", user);
  const employeeId = user?.employee?.id;
  console.log("Employee ID:", employeeId);
  useEffect(() => {
    const fetchpersonal = async () => {
      if (!employeeId) return; // wait until employeeId is available
      try {
        const res = await axios.get(`/employee_with_image/${employeeId}`);
        setpersonal(res.data);
      } catch (err) {
        console.error('Failed to fetch personal:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchpersonal();
  }, [employeeId]);


  const handleInputChange = (e) => {
    setpersonal({ ...personal, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/employees/${employeeId}`, personal);
      Swal.fire({ icon: 'success', title: 'personal update', text: 'personal updated!', });
      setEditing(false);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Update failed', });
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      await axios.post(`/employees/${employeeId}/upload-image`, formData);
      Swal.fire({ icon: 'success', title: 'Upload Image', text: 'Image uploaded!', });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Upload failed', });
    }
  };

  if (loading) return <p className="p-4">Loading personal...</p>;
  if (!personal) return <p className="p-4 text-red-600">personal not found.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-8">
      <div className="flex space-x-6 border-b pb-2 mb-4">
        <button
          onClick={() => setActiveTab('personal')}
          className={`text-lg font-semibold ${activeTab === 'personal' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Personal Details
        </button>
        {/* <button
          onClick={() => setActiveTab('education')}
          className={`text-lg font-semibold ${activeTab === 'education' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Education Details
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`text-lg font-semibold ${activeTab === 'experience' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Experience Details
        </button> */}
      </div>

      {activeTab === 'personal' && (
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* personal Card */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex gap-6">
              <div>
                <label className="block w-32 h-32 rounded-full bg-gray-100 overflow-hidden cursor-pointer">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : personal.image_path ? (
                    <img src={`http://localhost:8000/${personal.image_path}`} alt="Employee" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                      {personal.first_name?.[0]}{personal.last_name?.[0]}
                    </div>
                  )}

                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                {/* <button
                  onClick={handleImageUpload}
                  className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Upload
                </button> */}
              </div>

              {/* personal Details */}
              <div className="flex-1 space-y-4">
                {editing ? (
                  <>
                    <Input label="First Name" name="first_name" value={personal.first_name} onChange={handleInputChange} />
                    <Input label="Last Name" name="last_name" value={personal.last_name} onChange={handleInputChange} />
                    <Input label="Email" name="email" value={personal.email} onChange={handleInputChange} />
                    <div className="flex gap-2">
                      <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                      <button onClick={() => setEditing(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <Info label="Name" value={`${personal.first_name} ${personal.last_name}`} />
                    <Info label="Email" value={personal.email} />
                    <Info label="Department" value={personal.department?.name || `#${personal.department_id}`} />
                    <Info label="Role" value={personal.role?.name || `#${personal.role_id}`} />
                    <Info label="Joined On" value={personal.date_of_joining} />
                    <Info label="Status" value={personal.status} />
                    {/* <button onClick={() => setEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
                      Edit personal
                    </button> */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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

export default personal;
