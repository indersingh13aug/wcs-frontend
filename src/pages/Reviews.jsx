import React, { useEffect, useState } from 'react';
import axios from '../services/axios';

const PerformanceReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('/reviews');
        setReviews(res.data);
      } catch (err) {
        console.error('Failed to load performance reviews:', err);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Performance Reviews</h2>

      <div className="overflow-x-auto">
        {!showForm && (
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Employee</th>
              <th className="px-4 py-2 text-left">Review Date</th>
              <th className="px-4 py-2 text-left">Reviewer</th>
              <th className="px-4 py-2 text-left">Rating</th>
              <th className="px-4 py-2 text-left">Comments</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No reviews found.
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="border-t">
                  <td className="px-4 py-2">
                    {review.first_name} {review.last_name}
                  </td>
                  <td className="px-4 py-2">{review.review_date}</td>
                  <td className="px-4 py-2">{review.reviewer_name}</td>
                  <td className="px-4 py-2 font-semibold">{review.rating}</td>
                  <td className="px-4 py-2">{review.comments}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default PerformanceReviews;
