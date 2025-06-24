// src/pages/Project.jsx
import React, { useEffect, useState } from "react";
import axios from "../services/axios";
import Swal from "sweetalert2";
import ProjectForm from "../components/Forms/ProjectForm";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProjects = async () => {
    const res = await axios.get("/projects");
    setProjects(res.data);
  };

  const fetchClients = async () => {
    const res = await axios.get("/clients");
    setClients(res.data);
  };

  const fetchITEmployees = async () => {
    const res = await axios.get("/it");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchITEmployees();
  }, []);

  const handleAddClick = () => {
    setFormData({});
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditClick = (project) => {
    if (project.is_deleted) return;
    const assignedTeamArray = project.assigned_team
      ? project.assigned_team.split(",").map((id) => parseInt(id.trim())) 
      : [];
    setFormData({ ...project, assigned_team: assignedTeamArray });
    setEditingProject(project);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      assigned_team: formData.assigned_team.join(","),
    };

    try {
      if (editingProject) {
        await axios.put(`/projects/${editingProject.id}`, payload);
        Swal.fire({icon: 'success',title: 'Updated!',text: 'Project updated successfully.',});
      } else {
        await axios.post("/projects", payload);
         Swal.fire({icon: 'success',title: 'Created',text: 'Project added successfully.',});
      }
      fetchProjects();
      setShowForm(false);
    } catch (err) {
      const msg = err.response?.data?.detail || "Save failed.";
      Swal.fire({icon: 'error',title: 'Error',text: msg,});
    }
  };

  const handleActivate = async (id) => {
    await axios.put(`/projects/${id}/activate`);
    Swal.fire({icon: 'success',title: 'Activated!',text: "Project is now active.",});
    fetchProjects();
  };

  const handleDeactivate = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to deactivate this project?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
    });

    if (confirm.isConfirmed) {
      await axios.put(`/projects/${id}/deactivate`);
      Swal.fire({icon: 'success',title: 'Deactivated!',text: "Project has been deactivated.",});
      fetchProjects();
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Projects</h1>
        {!showForm && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleAddClick}
          >
            Add Project
          </button>
        )}
      </div>

      {showForm && (
        <ProjectForm
          formData={formData}
          setFormData={setFormData}
          clients={clients}
          employees={employees}
          onCancel={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}

      <table className="w-full border mt-6 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Client</th>
            <th className="border p-2">Assigned Team</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="border p-2">{project.name}</td>
              <td className="border p-2">{project.description}</td>
              <td className="border p-2">{project.client_name}</td>
              <td className="border p-2">{project.assigned_team_names}</td>
              <td className="border p-2">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    project.is_deleted
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {project.is_deleted ? "Inactive" : "Active"}
                </span>
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEditClick(project)}
                  disabled={project.is_deleted}
                  className={`px-2 py-1 rounded ${
                    project.is_deleted
                      ? "bg-gray-300 text-gray-600"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  Edit
                </button>
                {project.is_deleted ? (
                  <button
                    onClick={() => handleActivate(project.id)}
                    className="text-green-600 hover:underline"
                  >
                    Activate
                  </button>
                ) : (
                  <button
                    onClick={() => handleDeactivate(project.id)}
                    className="text-red-600 hover:underline"
                  >
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

export default Project;
