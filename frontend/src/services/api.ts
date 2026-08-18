import axios from 'axios';

// Get or generate guest session ID for carts
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('pv_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('pv_session_id', sessionId);
  }
  return sessionId;
};

export const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token & session ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pv_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.headers) {
      config.headers['x-session-id'] = getSessionId();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle unauthorized errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      // Clear token if expired when accessing admin
      localStorage.removeItem('pv_token');
      localStorage.removeItem('pv_user');
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    }
    return Promise.reject(error);
  }
);

export default api;
