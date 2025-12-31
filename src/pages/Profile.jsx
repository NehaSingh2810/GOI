import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { feedbackAPI, newsAPI } from '../services/api';

const Profile = () => {
  const { user, setAuth } = useAuth();
  const [profile, setProfile] = useState(user || {});
  const [stats, setStats] = useState({
    totalFeedback: 0,
    totalNews: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    try {
      const [feedbackRes, newsRes] = await Promise.all([
        feedbackAPI.getAll(),
        newsAPI.getAll()
      ]);
      
      const userFeedback = feedbackRes.data.filter(f => f.user === user.id);
      const userNews = newsRes.data.news.filter(n => n.author === user.id);
      
      const totalFeedback = userFeedback.length;
      const averageRating = totalFeedback > 0 
        ? userFeedback.reduce((acc, f) => acc + f.rating, 0) / totalFeedback 
        : 0;
      
      setStats({
        totalFeedback,
        totalNews: userNews.length,
        averageRating: averageRating.toFixed(1)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await authAPI.updateProfile({
        name: profile.name,
        email: profile.email
      });
      
      // Update auth context with new token and user returned from backend
      if (response.data?.token) {
        setAuth(response.data.token, response.data.user);
      }
      setMessage('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-navy-800 mb-2 animate-fade-in">My Profile</h1>
          <p className="text-navy-600">
            Manage your account information and view your activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-md animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h2 className="text-xl font-semibold text-navy-800">{profile.name || 'User'}</h2>
                <p className="text-navy-600">{profile.email}</p>
              </div>

              {message && (
                <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-navy-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-navy-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
              <h3 className="text-lg font-semibold text-navy-800 mb-4">Your Activity</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-navy-600">Feedback Given</span>
                  <span className="font-semibold text-orange-600">{stats.totalFeedback}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-navy-600">News Posted</span>
                  <span className="font-semibold text-navy-600">{stats.totalNews}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-navy-600">Average Rating</span>
                  <span className="font-semibold text-green-600">{stats.averageRating}/5</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
              <h3 className="text-lg font-semibold text-navy-800 mb-4">Account Info</h3>
              <div className="space-y-2 text-sm text-navy-600">
                <p>Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                <p>Last login: Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;