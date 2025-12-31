import React from 'react';
import { Link } from 'react-router-dom';

const NewsCard = ({ news }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <div className="h-48 overflow-hidden bg-gray-100">
        <img
          src={news.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image'}
          alt={news.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            if (!e.target.src.includes('via.placeholder.com')) e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
          }}
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-navy-800 mb-2 line-clamp-2">
              <Link
                to={`/news/${news._id}`}
                className="hover:text-orange-600 transition-colors"
              >
                {news.title}
              </Link>
            </h3>
            <p className="text-navy-600 mb-4 line-clamp-3">
              {news.content}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-navy-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {formatDate(news.createdAt)}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {news.category || 'General'}
            </span>
          </div>

          <Link
            to={`/news/${news._id}`}
            className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;