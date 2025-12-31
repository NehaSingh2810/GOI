import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { feedbackAPI } from '../services/api';
import { connectSocket, subscribeToFeedbackUpdates } from '../services/socket';

const MyFeedback = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbacks();

    // Connect to socket for real-time updates
    connectSocket();
    const unsubscribe = subscribeToFeedbackUpdates(() => {
      fetchFeedbacks();
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const fetchFeedbacks = async () => {
    if (!user) return;
    
    try {
      const response = await feedbackAPI.getAll();
      // The API already filters by user, so no need to filter again
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feedback) => {
    setEditingId(feedback._id);
    setEditForm({ rating: feedback.rating, comment: feedback.comment });
  };

  const handleUpdate = async (id) => {
    try {
      await feedbackAPI.update(id, editForm);
      setEditingId(null);
      fetchFeedbacks(); // Refresh the list
    } catch (error) {
      setError('Failed to update feedback');
      console.error('Error updating feedback:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await feedbackAPI.delete(id);
        fetchFeedbacks(); // Refresh the list
      } catch (error) {
        setError('Failed to delete feedback');
        console.error('Error deleting feedback:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ rating: 5, comment: '' });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-orange-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
      </div>
    );
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-navy-600">Loading your feedback...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-navy-800 mb-2 animate-fade-in">My Feedback History</h1>
          <p className="text-navy-600">
            View all your feedback submissions and their impact
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {feedbacks.length === 0 ? (
          <div className="text-center py-12">
            <div className="card p-8 animate-fade-in">
              <p className="text-navy-600 text-lg">You haven't submitted any feedback yet.</p>
              <p className="text-navy-500 mt-2">Start by reading news articles and sharing your thoughts!</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {feedbacks.map(feedback => (
              <div key={feedback._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-orange-500 animate-fade-in">
                {editingId === feedback._id ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-navy-800">Edit Feedback</h3>
                    <p className="text-navy-600">{feedback.news?.title || 'News Article'}</p>
                    
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">Rating</label>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditForm({...editForm, rating: star})}
                            className={`w-8 h-8 flex items-center justify-center ${star <= editForm.rating ? 'text-orange-400' : 'text-gray-300'} hover:text-orange-400 transition-colors transform hover:scale-110`}
                            aria-label={`${star} star`}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{editForm.rating}/5</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">Comment (optional)</label>
                      <textarea
                        value={editForm.comment}
                        onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2 border border-navy-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Share your thoughts..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(feedback._id)}
                        className="btn-primary px-4 py-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn-secondary px-4 py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-navy-800 mb-2 hover:text-orange-600 transition-colors">
                          {feedback.news?.title || 'News Article'}
                        </h3>
                        {feedback.comment && (
                          <p className="text-navy-600 mb-4 italic bg-gray-50 p-3 rounded-md border-l-4 border-orange-200">"{feedback.comment}"</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getSentimentColor(feedback.sentiment)} shadow-sm`}>
                          {feedback.sentiment}
                        </div>
                        <button
                          onClick={() => handleEdit(feedback)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                          title="Edit feedback"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(feedback._id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete feedback"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-navy-500">Your Rating:</span>
                        {renderStars(feedback.rating)}
                      </div>
                      <div className="text-sm text-navy-500 bg-gray-50 px-3 py-1 rounded-full">
                        {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFeedback;