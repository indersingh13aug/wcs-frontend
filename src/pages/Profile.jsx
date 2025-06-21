import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');  // 'profile' | 'password'
  const [profile, setProfile] = useState(null);
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
    const fetchProfile = async () => {
      if (!employeeId) return; // wait until employeeId is available
      try {
        const res = await axios.get(`/employees/${employeeId}`);
        setProfile(res.data);
        // alert(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [employeeId]);


  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/employees/${employeeId}`, profile);
      alert('Profile updated');
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      return alert('Passwords do not match');
    }
    try {
      await axios.post(`/employees/${employeeId}/change-password`, passwords);
      alert('Password updated');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      console.error(err);
      alert('Password update failed');
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
      alert('Image uploaded');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  if (loading) return <p className="p-4">Loading profile...</p>;
  if (!profile) return <p className="p-4 text-red-600">Profile not found.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-8">
      <div className="flex space-x-6 border-b pb-2 mb-4">
        <button
          onClick={() => setActiveTab('profile')}
          className={`text-lg font-semibold ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          My Profile
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`text-lg font-semibold ${activeTab === 'password' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Change Password
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Profile Card */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex gap-6">
              <div>
                <label className="block w-32 h-32 rounded-full bg-gray-100 overflow-hidden cursor-pointer">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                      {profile.first_name?.[0]}{profile.last_name?.[0]}
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                <button
                  onClick={handleImageUpload}
                  className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Upload
                </button>
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4">
                {editing ? (
                  <>
                    <Input label="First Name" name="first_name" value={profile.first_name} onChange={handleInputChange} />
                    <Input label="Last Name" name="last_name" value={profile.last_name} onChange={handleInputChange} />
                    <Input label="Email" name="email" value={profile.email} onChange={handleInputChange} />
                    <div className="flex gap-2">
                      <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                      <button onClick={() => setEditing(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <Info label="Name" value={`${profile.first_name} ${profile.last_name}`} />
                    <Info label="Email" value={profile.email} />
                    <Info label="Department" value={profile.department?.name  || `#${profile.department_id}`} />
                    <Info label="Role" value={profile.role?.name  || `#${profile.role_id}`} />
                    <Info label="Joined On" value={profile.date_of_joining} />
                    <Info label="Status" value={profile.status} />
                    <button onClick={() => setEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'password' && (
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

export default Profile;
