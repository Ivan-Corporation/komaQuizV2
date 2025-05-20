import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // or your backend URL
});

// Add token to Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage/token
      localStorage.removeItem('token');

      // Redirect to login
      window.location.href = '/login'; // or use history.push if inside a React component

      return Promise.reject(error); // optional: reject for further handling
    }

    return Promise.reject(error);
  }
);

export default api;