import React, { useEffect, useState } from "react";
import axios from "../services/axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const ProjectDetails = () => {
  const { user } = useAuth();
  const employeeId = user?.employee?.id;

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [taskAssignments, setTaskAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [taskStatus, setTaskStatus] = useState("");
  const [assignToId, setAssignToId] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [taskOptions, setTaskOptions] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  // Fetch all task assignments for current user
  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`/employees/${employeeId}/assignments`);
      const assignments = res.data.filter(a => !a.is_deleted);
      setTaskAssignments(assignments);

      if (assignments.length === 1) {
        setSelectedProjectId(assignments[0].project.id);
        setSelectedAssignmentId(assignments[0].id);
        setSelectedTaskId(assignments[0].task.id);
        setTaskStatus(assignments[0].status);
        setAssignToId(assignments[0].employee_id);
      } else if (assignments.length > 1) {
        setProjects(assignments.map(a => a.project));
      }
    } catch (err) {
      console.error("Failed to fetch assignments", err);
    }
  };

  // When project is selected
  const handleProjectChange = (e) => {
    const projectId = parseInt(e.target.value);
    setSelectedProjectId(projectId);

    const relatedAssignments = taskAssignments.filter(a => a.project.id === projectId);
    if (relatedAssignments.length > 0) {
      const current = relatedAssignments[0];
      setSelectedAssignmentId(current.id);
      setSelectedTaskId(current.task.id);
      setTaskStatus(current.status);
      setAssignToId(current.employee_id);
    }
  };

  const fetchEmployees = async () => {
    if (!selectedProjectId || !employeeId) return;
    try {
      const res = await axios.get(`/projects/${selectedProjectId}/employees`);
      const data = res.data;

      const currentUser = {
        id: employeeId,
        first_name: user.employee.first_name,
        last_name: user.employee.last_name,
      };

      const exists = data.some(e => e.id === currentUser.id);
      if (!exists) data.unshift(currentUser);

      setEmployeeOptions(data);
    } catch (err) {
      console.error("Failed to fetch project employees", err);
    }
  };

  const fetchComments = async (assignmentId) => {
    try {
      const res = await axios.get(`/task-assignments/${assignmentId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedAssignmentId || !taskStatus || !assignToId || !comment) {
      Swal.fire({ icon: "error", title: "Validation", text: "All fields are required." });
      return;
    }

    try {
      await axios.put(`/task-assignments/${selectedAssignmentId}`, {
        status: taskStatus,
        employee_id: assignToId
      });

      await axios.post(`/task-comments`, {
        assignment_id: selectedAssignmentId,
        comment,
        employee_id: employeeId
      });

      Swal.fire({ icon: "success", title: "Task Updated" });
      setComment("");
      fetchComments(selectedAssignmentId);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Update failed", text: "Something went wrong." });
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (selectedAssignmentId) {
      fetchEmployees();
      fetchComments(selectedAssignmentId);
    }
  }, [selectedAssignmentId]);

  const currentProject = taskAssignments.find(a => a.project.id === selectedProjectId);
  const currentTask = taskAssignments.find(a => a.id === selectedAssignmentId)?.task;

  if (!taskAssignments.length) {
    return <p className="p-6 text-center text-red-600">No active task assigned to you.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {projects.length > 1 && (
        <div>
          <label className="font-medium">Select Project:</label>
          <select
            value={selectedProjectId || ""}
            onChange={handleProjectChange}
            className="w-full border px-3 py-2 rounded mt-1"
          >
            <option value="" disabled>Select project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      {currentProject && (
        <>
          <div className="bg-gray-50 p-4 border rounded space-y-2">
            <p><strong>Project:</strong> {currentProject.project.name}</p>
            <p><strong>Assigned to:</strong> {user.employee.first_name} {user.employee.last_name}</p>
            <p><strong>Start Date:</strong> {currentProject.start_date}</p>
            <p><strong>End Date:</strong> {currentProject.end_date}</p>

            <label className="block mt-4 font-medium">Task</label>
            <p className="border px-3 py-2 rounded">{currentTask?.name}</p>

            <label className="block mt-4 font-medium">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full border px-3 py-2 rounded"
            />

            <label className="block mt-4 font-medium">Assign To</label>
            <select
              value={assignToId || ""}
              onChange={(e) => setAssignToId(parseInt(e.target.value))}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="" disabled>Select employee</option>
              {employeeOptions.map(e => (
                <option key={e.id} value={e.id}>
                  {e.first_name} {e.last_name} {e.id === employeeId ? "(Me - Assigned to me)" : ""}
                </option>
              ))}
            </select>

            <label className="block mt-4 font-medium">Status</label>
            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
              <option value="Close">Close</option>
            </select>

            <button
              onClick={handleUpdateTask}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update Task
            </button>
          </div>

          <div className="mt-6 max-h-64 overflow-y-auto border rounded p-4 bg-gray-50">
            <h2 className="text-lg font-semibold mb-2">Comment History</h2>
            {comments.length === 0 && (
              <p className="text-gray-500">No comments yet.</p>
            )}
            {comments.map(c => (
              <div key={c.id} className="mb-4 border-b pb-2">
                <p className="text-sm">{c.comment}</p>
                <p className="text-xs text-gray-600 mt-1">
                  By {c.employee_name} on {new Date(c.timestamp).toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">
                  Status: {c.status || "N/A"} | Assigned To: {c.assigned_to || "N/A"}
                </p>
              </div>
            ))}
          </div>

        </>
      )}
    </div>
  );
};

export default ProjectDetails;
