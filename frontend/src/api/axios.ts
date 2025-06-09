import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // needed to send HttpOnly cookies (refresh token)
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 with refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Request a new access token
        const res = await axios.post('http://localhost:8000/auth/refresh', {}, { withCredentials: true });

        const newToken = res.data.access_token;

        // Store new token
        localStorage.setItem('token', newToken);

        // Set Authorization header again
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear token and redirect
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('token-expired'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
