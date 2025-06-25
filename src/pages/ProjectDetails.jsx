import React, { useEffect, useState } from "react";
import axios from "../services/axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const ProjectDetails = () => {
  const { user } = useAuth();
  const employeeId = user?.employee?.id;

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [status, setStatus] = useState("New");
  const [assignedTo, setAssignedTo] = useState("");
  const [employeeList, setEmployeeList] = useState([]);

  // Fetch active projects
  useEffect(() => {
    if (!employeeId) return;
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`/employee/${employeeId}/active-projects`);
        setProjects(res.data);
        if (res.data.length === 1) {
          setSelectedProject(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching projects", err);
      }
    };
    fetchProjects();
  }, [employeeId]);

  // Fetch tasks for selected project
  useEffect(() => {
    if (!selectedProject) return;
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`/employee/${employeeId}/project-tasks/${selectedProject.project_id}`);
        setTasks(res.data);
        if (res.data.length > 0) {
          setSelectedTaskId(res.data[0].task_id);
        }
      } catch (err) {
        console.error("Error fetching tasks", err);
      }
    };
    fetchTasks();
  }, [selectedProject, employeeId]);

  // Fetch assignment and comment details
  useEffect(() => {
    if (!selectedTaskId || !selectedProject) return;
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`/task-assignments?employee_id=${employeeId}&project_id=${selectedProject.project_id}&task_id=${selectedTaskId}`);
        const assign = res.data[0];
        if (assign) {
          setAssignment(assign);
          setStatus(assign.status);
          setAssignedTo(assign.employee_id);
          fetchComments(assign.id);
          fetchEmployeeList(selectedProject.project_id);
        }
      } catch (err) {
        console.error("Error fetching assignment", err);
      }
    };
    fetchDetails();
  }, [selectedTaskId, selectedProject]);

  const fetchComments = async (assignmentId) => {
    try {
      const res = await axios.get(`/task-assignments/${assignmentId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  const fetchEmployeeList = async (projectId) => {
    try {
      const res = await axios.get(`/projects/${projectId}/employees`);
      const filtered = res.data.filter(e => e.id !== employeeId);
      setEmployeeList(filtered);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  const handleProjectChange = (e) => {
    const proj = projects.find(p => p.project_id === parseInt(e.target.value));
    setSelectedProject(proj);
    setTasks([]);
    setAssignment(null);
    setComments([]);
    setSelectedTaskId(null);
  };

  const handleTaskChange = (e) => {
    setSelectedTaskId(parseInt(e.target.value));
  };

  const handleSubmitComment = async () => {
    if (!commentInput || !assignment) return;
    try {
      await axios.post("/task-comments", {
        assignment_id: assignment.id,
        comment: commentInput,
        employee_id: employeeId,
      });
      setCommentInput("");
      fetchComments(assignment.id);
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleUpdateTask = async () => {
    try {
      await axios.put(`/task-assignments/${assignment.id}`, {
        employee_id: assignedTo,
        status: status,
      });
      Swal.fire("Updated!", "Task updated successfully.", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to update task", "error");
    }
  };

  if (projects.length === 0) {
    return <div className="p-6 text-red-600">No active task assigned to you.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      {projects.length > 1 && (
        <div className="mb-4">
          <label className="font-medium">Select Project:</label>
          <select
            className="ml-2 border rounded px-2 py-1"
            value={selectedProject?.project_id || ""}
            onChange={handleProjectChange}
          >
            <option value="" disabled>Select project</option>
            {projects.map(p => (
              <option key={p.project_id} value={p.project_id}>{p.project_name}</option>
            ))}
          </select>
        </div>
      )}

      {assignment && (
        <>
          <div className="bg-gray-100 p-4 rounded shadow">
            <p><strong>Project:</strong> {selectedProject?.project_name}</p>
            <p><strong>Assigned To:</strong> {user?.employee?.first_name} {user?.employee?.last_name}</p>
            <p><strong>Start Date:</strong> {assignment.start_date}</p>
            <p><strong>End Date:</strong> {assignment.end_date}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-medium">Task:</label>
              <select value={selectedTaskId} onChange={handleTaskChange} className="border rounded px-2 py-1 w-full">
                {tasks.map(t => (
                  <option key={t.task_id} value={t.task_id}>{t.task_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium">Comment:</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button
                onClick={handleSubmitComment}
                className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
              >
                Submit Comment
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Assign To:</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(parseInt(e.target.value))}
                >
                  <option value="">-- Select --</option>
                  {employeeList.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium">Task Status:</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>New</option>
                  <option>In Progress</option>
                  <option>Done</option>
                  <option>Close</option>
                </select>
              </div>
            </div>

            <button onClick={handleUpdateTask} className="bg-green-600 text-white px-4 py-2 rounded">
              Update Task
            </button>
          </div>

          <div className="mt-6 max-h-60 overflow-y-auto bg-white border p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Comment History</h3>
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              comments.map(c => (
                <div key={c.id} className="mb-3 border-b pb-2">
                  <p>{c.comment}</p>
                  <small className="text-gray-500">By {c.employee_name} on {new Date(c.timestamp).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
