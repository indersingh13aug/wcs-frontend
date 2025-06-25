// src/components/CommentSection.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import { useAuth } from '../../context/AuthContext';

const CommentSection = ({ assignmentId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/task-comments/${assignmentId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to load comments', err);
    }
  };

  useEffect(() => {
    if (assignmentId) fetchComments();
  }, [assignmentId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post('/task-comments', {
        assignment_id: assignmentId,
        comment: newComment,
        employee_id: user?.employee?.id,
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Failed to add comment');
    }
  };
  const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
};

  return (
    <div className="bg-white p-4 mt-4 rounded shadow">
      <h3 className="font-semibold mb-2">Comments</h3>

      <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="border rounded p-2">
              <p className="text-sm text-gray-700">{c.comment}</p>
              <div className="text-xs text-gray-500 mt-1">
                <strong>By {c.employee_name}</strong> on {formatDate(c.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Comment
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
