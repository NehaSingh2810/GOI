import React, { useState, useEffect } from 'react';
import { newsAPI } from '../services/api';
import { connectSocket, subscribeToNewsUpdates } from '../services/socket';
import NewsCard from '../components/NewsCard';

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Technology', 'Infrastructure', 'Education', 'Healthcare', 'Economy', 'Environment', 'Agriculture'];

  useEffect(() => {
    fetchNews();

    // Connect to socket for real-time updates
    connectSocket();
    const unsubscribe = subscribeToNewsUpdates((updatedNews) => {
      setNews(prevNews =>
        prevNews.map(item =>
          item._id === updatedNews._id ? updatedNews : item
        )
      );
    });

    return () => {
      unsubscribe();
    };
  }, [selectedCategory]);

  const fetchNews = async (pageNum = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await newsAPI.getAll(pageNum, 12, selectedCategory === 'All' ? null : selectedCategory);

      let filteredNews = response.data.news || [];

      if (append) {
        setNews(prev => [...prev, ...filteredNews]);
      } else {
        setNews(filteredNews);
      }

      // If no results for this category on first page, try to populate from external API and retry once
      if (!append && filteredNews.length === 0) {
        try {
          if (selectedCategory && selectedCategory !== 'All') {
            await newsAPI.fetchExternal(selectedCategory);
          } else {
            await newsAPI.fetchExternal();
          }
          const retry = await newsAPI.getAll(pageNum, 12, selectedCategory === 'All' ? null : selectedCategory);
          const retryNews = retry.data.news || [];
          setNews(retryNews);
          setHasMore(retry.data.hasMore || false);
        } catch (err) {
          console.error('Populate retry failed:', err);
        }
      }

      setHasMore(response.data.hasMore || false);
    } catch (error) {
      setError('Failed to load news');
      console.error('Error fetching news:', error);
      // If nothing found for a category, try fetching from external API and retry once
      try {
        if (selectedCategory && selectedCategory !== 'All') {
          await newsAPI.fetchExternal(selectedCategory);
        } else {
          await newsAPI.fetchExternal();
        }
        // retry fetch
        const retryResp = await newsAPI.getAll(pageNum, 12, selectedCategory === 'All' ? null : selectedCategory);
        const retryNews = retryResp.data.news || [];
        setNews(retryNews);
        setError('');
      } catch (err) {
        console.error('Retry fetch failed:', err);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage, true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-navy-800 mb-2 animate-fade-in">News Feed</h1>
          <p className="text-navy-600">
            Stay updated with the latest news and announcements from the Government of India
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-white text-navy-600 border border-navy-200 hover:bg-navy-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {news.length === 0 ? (
          <div className="text-center py-12">
            <div className="card p-8">
              <p className="text-navy-600 text-lg">No news available in this category.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {news.map((item) => (
                <NewsCard key={item._id} news={item} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="btn-primary"
                >
                  {loadingMore ? 'Loading...' : 'Load More News'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;