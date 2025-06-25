import React, { useEffect, useState } from "react";
import axios from "../services/axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const ProjectDetails = () => {
  const { user } = useAuth();
  const employeeId = user?.employee?.id;

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectTasks, setProjectTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [assignment, setAssignment] = useState(null);

  const [comment, setComment] = useState("");
  const [assignToId, setAssignToId] = useState("");
  const [status, setStatus] = useState("");
  const [employees, setEmployees] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`/employees/${employeeId}/assignments`)
      .then(res => {
        const assignments = res.data;
        setAllAssignments(assignments); // save full list

        if (assignments.length === 0) {
          setProjects([]); // clear any old state
          return; // no need to continue
        }

        const uniqueProjects = [
          ...new Map(assignments.map(a => [a.project.id, a.project])).values()
        ];
        setProjects(uniqueProjects);
      })
      .catch(err => {
        console.error("Failed to fetch assignments", err);
      });
  }, [employeeId]);



  const handleProjectChange = async (e) => {
    const pid = e.target.value;
    setSelectedProjectId(pid);
    setSelectedTaskId("");
    setAssignment(null);
    setComment("");
    setStatus("");
    setAssignToId("");
    setComments([]);

    // Fetch tasks under this project assigned to current employee
    const res = await axios.get(`/employees/${employeeId}/assignments`);
    const tasksForProject = res.data.filter(
      a => a.project.id === parseInt(pid)
    ).map(a => a.task);

    setProjectTasks(tasksForProject);
  };

  const handleTaskChange = async (e) => {
    const tid = e.target.value;
    setSelectedTaskId(tid);

    // Fetch assignment
    const res = await axios.get(`/employees/${employeeId}/assignments`);
    const a = res.data.find(
      a => a.project.id === parseInt(selectedProjectId) && a.task.id === parseInt(tid)
    );

    setAssignment(a);
    setComment("");
    setStatus(a?.status || "");
    setAssignToId(a?.employee_id || "");

    // Fetch employees in this project
    const empRes = await axios.get(`/projects/${selectedProjectId}/employees`);
    const currentEmp = {
      id: employeeId,
      first_name: user.employee.first_name,
      last_name: user.employee.last_name
    };
    if (!empRes.data.find(e => e.id === currentEmp.id)) {
      empRes.data.unshift(currentEmp);
    }
    setEmployees(empRes.data);

    // Fetch comments
    const commentsRes = await axios.get(`/task-assignments/${a?.id}/comments`);
    setComments(commentsRes.data);
  };

  const handleUpdate = async () => {
    if (!assignment || !comment || !assignToId || !status) {
      Swal.fire("Validation", "All fields are required", "warning");
      return;
    }

    try {
      await axios.put(`/task-assignments/${assignment.id}`, {
        employee_id: assignToId,
        status
      });

      await axios.post(`/task-comments`, {
        assignment_id: assignment.id,
        comment,
        employee_id: employeeId,
        status,
        assigned_to_id: assignToId
      });

      Swal.fire("Success", "Task updated", "success");
      setComment("");
      const updatedComments = await axios.get(`/task-assignments/${assignment.id}/comments`);
      setComments(updatedComments.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Update failed", "error");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {projects.length === 0 && (
        <p className="text-center text-red-600">There is no task assigned to you.</p>
      )}
       {projects.length > 0 && (
      <div>
        <label className="font-medium">Project:</label>
        <select
          className="w-full border px-3 py-2 rounded mt-1"
          value={selectedProjectId}
          onChange={handleProjectChange}
        >
          <option value="">--- Select Project ---</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
       )}
      {selectedProjectId && (
        <div>
          <label className="font-medium">Task:</label>
          <select
            className="w-full border px-3 py-2 rounded mt-1"
            value={selectedTaskId}
            onChange={handleTaskChange}
          >
            <option value="">--- Select Task ---</option>
            {projectTasks.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      )}

      {assignment && (
        <div className="bg-gray-50 border rounded p-4 space-y-4">
          <p><strong>Project:</strong> {assignment.project.name}</p>
          <p><strong>Assigned To:</strong> {assignment.employee.first_name} {assignment.employee.last_name}</p>
          <p><strong>Start Date:</strong> {assignment.start_date}</p>
          <p><strong>End Date:</strong> {assignment.end_date}</p>
          <p><strong>Task:</strong> {assignment.task.name}</p>

          <div>
            <label className="block font-medium">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full border px-3 py-2 rounded"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium">Assign To</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={assignToId}
              onChange={(e) => setAssignToId(e.target.value)}
            >
              <option value="">-- Select Employee --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name} {emp.id === employeeId ? "(Me)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">-- Select Status --</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
              <option value="Close">Close</option>
            </select>
          </div>

          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleUpdate}
          >
            Update Task
          </button>

          <div className="mt-6 max-h-64 overflow-y-auto border rounded p-4 bg-gray-100">
            <h2 className="text-lg font-semibold mb-2">Comment History</h2>
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="mb-2">
                  <p className="text-sm">{c.comment}</p>
                  <p className="text-xs text-gray-500">
                    By {c.employee_name} on {new Date(c.timestamp).toLocaleString()}
                  </p>
                  {c.status && (
                    <p className="text-xs text-gray-600">
                      Status: {c.status}, Assigned To: {c.assigned_to}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ProjectDetails;
