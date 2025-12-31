import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsAPI, feedbackAPI } from '../services/api';
import { connectSocket, subscribeToFeedbackUpdates } from '../services/socket';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';
import { useAuth } from '../context/AuthContext';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [news, setNews] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNews();
    fetchFeedbacks();

    // Connect to socket for real-time updates
    connectSocket();
    const unsubscribeFeedback = subscribeToFeedbackUpdates((updatedFeedback) => {
      if (updatedFeedback.newsId === id) {
        setFeedbacks(prev => [updatedFeedback, ...prev]);
      }
    });

    return () => {
      unsubscribeFeedback();
    };
  }, [id]);

  const fetchNews = async () => {
    try {
      const response = await newsAPI.getById(id);
      setNews(response.data);
    } catch (error) {
      setError('Failed to load news article');
      console.error('Error fetching news:', error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await feedbackAPI.getByNews(id);
      setFeedbacks(response.data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmitted = () => {
    fetchFeedbacks(); // Refresh feedbacks after submission
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-navy-600">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-fade-in">
            {error || 'News article not found'}
          </div>
          <button
            onClick={() => navigate('/news')}
            className="text-orange-600 hover:text-orange-700 font-medium flex items-center"
          >
            ← Back to News Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/news')}
          className="text-orange-600 hover:text-orange-700 font-medium mb-6 flex items-center animate-fade-in"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to News Feed
        </button>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8 animate-fade-in">
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">
                {news.title}
              </h1>

              <div className="flex flex-wrap items-center text-sm text-navy-600 space-x-4 mb-4">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {formatDate(news.createdAt)}
                </span>
                {news.category && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {news.category}
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-navy-700 leading-relaxed">
                {news.content}
              </div>
            </div>
          </div>
        </article>

        {/* Feedback Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-1">
            {user ? (
              <FeedbackForm
                newsId={id}
                onFeedbackSubmitted={handleFeedbackSubmitted}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center animate-fade-in">
                <h3 className="text-lg font-semibold text-navy-800 mb-4">
                  Want to share feedback?
                </h3>
                <p className="text-navy-600 mb-4">
                  Please log in to share your thoughts about this article.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary"
                >
                  Log In
                </button>
              </div>
            )}
          </div>

          {/* Feedback List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-navy-800 mb-4">
                Community Feedback ({feedbacks.length})
              </h3>
              <FeedbackList feedbacks={feedbacks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;