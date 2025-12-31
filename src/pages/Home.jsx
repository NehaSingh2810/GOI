import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsAPI } from '../services/api';
import { connectSocket, subscribeToNewsUpdates } from '../services/socket';
import NewsCard from '../components/NewsCard';
import Logo from '../components/Logo';

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Home component mounted, fetching news...');
    fetchNews();

    connectSocket();
    const unsubscribe = subscribeToNewsUpdates((updatedNews) => {
      console.log('Received news update:', updatedNews);
      setNews(prevNews =>
        prevNews.map(item =>
          item._id === updatedNews._id ? updatedNews : item
        )
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchNews = async () => {
    try {
      console.log('Testing simple API call...');
      const healthResponse = await fetch('http://localhost:5000/api/health');
      console.log('Health check response:', healthResponse);
      
      console.log('Fetching news from API...');
      const response = await newsAPI.getAll(1, 10); 
      console.log('API response:', response);
      const allNews = response.data.news || [];
      console.log('All news:', allNews);
      setNews(allNews.slice(0, 3)); 
      console.log('Final news to display:', allNews.slice(0, 3));
    } catch (error) {
      console.error('Detailed error fetching news:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      setError(`Failed to load news: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      
      <div className="gradient-bg text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slide-up">
            <div className="flex justify-center mb-6">
              <Logo className="w-20 h-20 animate-bounce-subtle" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient animate-fade-in">
              Gov360
            </h1>
            <p className="text-xl md:text-2xl text-orange-200 mb-8 animate-bounce-subtle">
              Government of India Citizen Feedback Platform
            </p>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Stay informed with the latest news, announcements, and updates from the Government of India.
              Your trusted source for official information and citizen engagement. Join thousands of citizens
              in shaping the future of governance through meaningful feedback and participation.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-4 transform hover:scale-105 transition-transform duration-200"
              >
                Join the Conversation
              </Link>
              <Link
                to="/news"
                className="btn-secondary text-lg px-8 py-4 transform hover:scale-105 transition-transform duration-200"
              >
                Browse Latest News
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute top-20 left-10 w-4 h-4 bg-orange-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card p-8 text-center animate-slide-up hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="text-4xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform">
              {news.length}+
            </div>
            <div className="text-navy-600 font-semibold">Latest News</div>
            <div className="w-0 group-hover:w-full h-1 bg-orange-600 transition-all duration-300 mt-2"></div>
          </div>
          <div className="card p-8 text-center animate-slide-up hover:shadow-lg transition-all duration-300 cursor-pointer group" style={{animationDelay: '0.1s'}}>
            <div className="text-4xl font-bold text-navy-600 mb-2 group-hover:scale-110 transition-transform">
              24/7
            </div>
            <div className="text-navy-600 font-semibold">Real-time Updates</div>
            <div className="w-0 group-hover:w-full h-1 bg-navy-600 transition-all duration-300 mt-2"></div>
          </div>
          <div className="card p-8 text-center animate-slide-up hover:shadow-lg transition-all duration-300 cursor-pointer group" style={{animationDelay: '0.2s'}}>
            <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform">
              100%
            </div>
            <div className="text-navy-600 font-semibold">Official Source</div>
            <div className="w-0 group-hover:w-full h-1 bg-green-600 transition-all duration-300 mt-2"></div>
          </div>
          <div className="card p-8 text-center animate-slide-up hover:shadow-lg transition-all duration-300 cursor-pointer group" style={{animationDelay: '0.3s'}}>
            <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">
              ∞
            </div>
            <div className="text-navy-600 font-semibold">Citizen Voices</div>
            <div className="w-0 group-hover:w-full h-1 bg-purple-600 transition-all duration-300 mt-2"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-navy-800 mb-12 animate-fade-in">
            Why Choose Gov360?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-6 text-center animate-slide-up group hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-navy-800 mb-3">Real-time Updates</h3>
              <p className="text-navy-600">Get instant notifications about government announcements and policy changes as they happen.</p>
            </div>
            <div className="card p-6 text-center animate-slide-up group hover:shadow-xl transition-all duration-300" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-gradient-to-r from-navy-600 to-navy-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-navy-800 mb-3">Official Information</h3>
              <p className="text-navy-600">Access verified and authentic information directly from government sources.</p>
            </div>
            <div className="card p-6 text-center animate-slide-up group hover:shadow-xl transition-all duration-300" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-navy-800 mb-3">Citizen Engagement</h3>
              <p className="text-navy-600">Participate in discussions, submit feedback, and help shape government policies.</p>
            </div>
          </div>
        </div>

        {/* Latest News */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
            <Link
              to="/login"
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              More →
            </Link>
          </div>

          {news.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No news available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <div key={item._id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <NewsCard news={item} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="card p-12 text-center animate-fade-in">
          <h3 className="text-3xl font-bold text-navy-800 mb-6 text-gradient">
            Stay Connected
          </h3>
          <p className="text-navy-600 mb-8 max-w-2xl mx-auto text-lg">
            Get real-time notifications about important government announcements and updates.
            Create an account to receive personalized news and participate in discussions.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-4"
            >
              Create Account
            </Link>
            <Link
              to="/news"
              className="btn-secondary text-lg px-8 py-4"
            >
              Browse News
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;