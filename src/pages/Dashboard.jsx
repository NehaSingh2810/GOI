import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { newsAPI, feedbackAPI } from '../services/api';
import { connectSocket, subscribeToFeedbackUpdates } from '../services/socket';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalNews: 0,
    feedbackGiven: 0,
    averageRating: 0,
    contributionLevel: 0
  });

  useEffect(() => {
    fetchStats();

    connectSocket();
    const unsubscribe = subscribeToFeedbackUpdates(() => {
      fetchStats();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchStats = async () => {
    try {
      const newsResponse = await newsAPI.getAll();
      const feedbackResponse = await feedbackAPI.getAll();
      
      const totalNews = newsResponse.data.news.length;
      const userFeedback = feedbackResponse.data.filter(f => f.user === user.id);
      const feedbackGiven = userFeedback.length;
      const averageRating = feedbackGiven > 0 
        ? userFeedback.reduce((acc, f) => acc + f.rating, 0) / feedbackGiven 
        : 0;
      
      setStats({ 
        totalNews, 
        feedbackGiven, 
        averageRating: averageRating.toFixed(1),
        contributionLevel: feedbackGiven > 10 ? 'High' : feedbackGiven > 5 ? 'Medium' : 'Low'
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-navy-800 mb-8 animate-fade-in">
          Welcome back, {user?.name || 'User'}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card p-6 text-center animate-slide-up">
            <div className="text-4xl font-bold text-orange-600 mb-2">{stats.totalNews}</div>
            <div className="text-navy-600 font-semibold">Total News</div>
          </div>
          <div className="card p-6 text-center animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="text-4xl font-bold text-navy-600 mb-2">{stats.feedbackGiven}</div>
            <div className="text-navy-600 font-semibold">Feedback Given</div>
          </div>
          <div className="card p-6 text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.averageRating}</div>
            <div className="text-navy-600 font-semibold">Average Rating</div>
          </div>
          <div className="card p-6 text-center animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="text-4xl font-bold text-purple-600 mb-2">{stats.contributionLevel}</div>
            <div className="text-navy-600 font-semibold">Contribution Level</div>
          </div>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-navy-50 rounded-lg">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-4"></div>
              <div>
                <p className="text-navy-800 font-medium">Welcome to Gov Feedback!</p>
                <p className="text-navy-600 text-sm">Start exploring news and sharing your feedback</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
              <div>
                <p className="text-navy-800 font-medium">Your feedback matters</p>
                <p className="text-navy-600 text-sm">Help improve government communication</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;