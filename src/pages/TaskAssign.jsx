import React, { useEffect, useState } from "react";
import axios from "../services/axios";
import CommentSection from "../components/Forms/CommentSection";
import TaskAssignForm from "../components/Forms/TaskAssignForm";

const TaskAssign = () => {
  const [assignments, setAssignments] = useState([]);
  const [openComments, setOpenComments] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    task_id: '',
    employee_id: '',
    start_date: '',
    end_date: '',
    comments: ''
  });

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("/task-assignments");
      setAssignments(res.data);
    } catch (err) {
      console.error("Failed to fetch assignments", err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddClick = () => {
    setFormData({
      project_id: '',
      task_id: '',
      employee_id: '',
      start_date: '',
      end_date: '',
      comments: ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const { project_id, task_id, employee_id, start_date, end_date, comments } = formData;

  if (!project_id || !task_id || !employee_id || !start_date || !end_date) {
    alert('All fields are required');
    return;
  }

  try {
    // Step 1: Create task assignment
    const res = await axios.post("/task-assignments", {
      project_id,
      task_id,
      employee_id,
      start_date,
      end_date
    });
    const assignmentId = res.data?.id;

    // Step 2: Save initial comment if present
    if (comments?.trim() && assignmentId) {
      await axios.post("/task-comments", {
        assignment_id: assignmentId,
        employee_id: employee_id,
        comment: comments.trim(),
        status: "New",                       // ✅ status saved as "New"
        assigned_to_id: employee_id         // ✅ assigned_to recorded
      });
    }

    setShowForm(false);
    fetchAssignments();
  } catch (err) {
    console.error("Failed to assign task", err);
    alert("Task assignment failed");
  }
};


  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Assign Task</h1>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Assign Task
          </button>
        )}
      </div>

      {showForm && (
        <TaskAssignForm
          formData={formData}
          setFormData={setFormData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {!showForm && (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Project</th>
              <th className="border p-2">Task</th>
              <th className="border p-2">Employee</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">End Date</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <React.Fragment key={a.id}>
                <tr>
                  <td className="border p-2">{a.project?.name || `#${a.project_id}`}</td>
                  <td className="border p-2">{a.task?.name || `#${a.task_id}`}</td>
                  <td className="border p-2">{a.employee?.first_name} {a.employee?.last_name}</td>
                  <td className="border p-2">{a.start_date}</td>
                  <td className="border p-2">{a.end_date}</td>
                  <td className="border p-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setOpenComments(openComments === a.id ? null : a.id)}
                    >
                      {openComments === a.id ? 'Hide Comments' : 'View Comments'}
                    </button>
                  </td>
                </tr>
                {openComments === a.id && (
                  <tr>
                    <td colSpan="6">
                      <CommentSection assignmentId={a.id} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskAssign;
