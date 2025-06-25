import axios from '../services/axios';
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import TaskForm from "../components/Forms/TaskForm";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddClick = () => {
    setFormData({});
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditClick = (task) => {
    if (task.is_deleted) return;
    setFormData(task);
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await axios.put(`/tasks/${editingTask.id}`, formData);
      } else {
        await axios.post('/tasks', formData);
      }
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.detail || 'Save failed',
      });
    }
  };

  const handleActivate = async (id) => {
    try {
      await axios.put(`/tasks/${id}/activate`);
      Swal.fire('Activated!', 'Task activated successfully.', 'success');
      fetchTasks();
    } catch (err) {
      Swal.fire('Error', 'Activation failed.', 'error');
    }
  };

  const handleDeactivate = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to deactivate this task?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, deactivate',
    });
    if (confirm.isConfirmed) {
      try {
        await axios.put(`/tasks/${id}/deactivate`);
        Swal.fire('Deactivated!', 'Task deactivated successfully.', 'success');
        fetchTasks();
      } catch (err) {
        Swal.fire('Error', 'Deactivation failed.', 'error');
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
        )}
      </div>

      {showForm && (
        <TaskForm
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
              <th className="border p-2">Task Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td className="border p-2">{task.name}</td>
                <td className="border p-2">{task.description}</td>
                <td className="border p-2">
                  <span className={`px-2 py-1 rounded text-sm ${task.is_deleted ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {task.is_deleted ? 'Inactive' : 'Active'}
                  </span>
                </td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleEditClick(task)}
                    className={`px-2 py-1 rounded ${task.is_deleted ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                    disabled={task.is_deleted}
                  >
                    Edit
                  </button>
                  {task.is_deleted ? (
                    <button onClick={() => handleActivate(task.id)} className="text-green-600 hover:underline">
                      Activate
                    </button>
                  ) : (
                    <button onClick={() => handleDeactivate(task.id)} className="text-red-600 hover:underline">
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

export default Tasks;
