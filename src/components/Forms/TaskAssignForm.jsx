import React, { useEffect, useState } from "react";
import axios from "../../services/axios";

const TaskAssignForm = ({ formData, setFormData, onChange, onSubmit, onCancel }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Load all projects and tasks initially
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [projectRes, taskRes] = await Promise.all([
          axios.get("/projects"),
          axios.get("/tasks")
        ]);
        setProjects(projectRes.data);
        setTasks(taskRes.data);
      } catch (err) {
        console.error("Dropdown fetch failed", err);
      }
    };

    fetchDropdowns();
  }, []);

  // Watch project_id change to load mapped employees
  useEffect(() => {
    const fetchProjectEmployees = async () => {
      if (!formData.project_id) {
        setEmployees([]);
        return;
      }

      try {
        const res = await axios.get(`/projects/${formData.project_id}/employees`);
        setEmployees(res.data);
      } catch (err) {
        console.error("Failed to fetch project-specific employees", err);
        setEmployees([]);
      }
    };

    fetchProjectEmployees();
  }, [formData.project_id]);

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <div>
        <label className="block text-sm font-medium mb-1">Project</label>
        <select
          name="project_id"
          value={formData.project_id}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Select Project --</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Task</label>
        <select
          name="task_id"
          value={formData.task_id}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Select Task --</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Employee</label>
        <select
          name="employee_id"
          value={formData.employee_id}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Select Employee --</option>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name}
              </option>
            ))
          ) : (
            <option disabled>No employees mapped</option>
          )}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Initial Comment</label>
        <textarea
          name="comments"
          value={formData.comments}
          onChange={onChange}
          rows={3}
          className="w-full border px-3 py-2 rounded"
        ></textarea>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
};

export default TaskAssignForm;
