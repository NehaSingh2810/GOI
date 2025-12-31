import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// News API
export const newsAPI = {
  getAll: (page = 1, limit = 10, category = null) => {
    const categoryParam = category ? `&category=${encodeURIComponent(category)}` : '';
    return api.get(`/news?page=${page}&limit=${limit}${categoryParam}`);
  },
  getById: (id) => api.get(`/news/${id}`),
  create: (newsData) => api.post('/news', newsData),
  update: (id, newsData) => api.put(`/news/${id}`, newsData),
  delete: (id) => api.delete(`/news/${id}`),
  // fetch latest from external API and save to DB (optional category param)
  fetchExternal: (category = null) => api.post(`/news/fetch`, { category })
};

// Feedback API
export const feedbackAPI = {
  getAll: () => api.get('/feedback/user'),
  getById: (id) => api.get(`/feedback/${id}`),
  create: (feedbackData) => api.post('/feedback', feedbackData),
  update: (id, feedbackData) => api.put(`/feedback/${id}`, feedbackData),
  delete: (id) => api.delete(`/feedback/${id}`),
  getByNews: (newsId) => api.get(`/feedback/${newsId}`),
};

export default api;