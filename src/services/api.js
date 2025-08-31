import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://eventx-backend-sxv2.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      window.location.href = '/login';
    }
    
    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }
    
    if (!error.response) {
      console.error('Network error');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    return Promise.reject(error);
  }
);

export const eventAPI = {
  // Get events with query parameters
  getEvents: (params = {}) => api.get('/events', { params }),
  
  // Get single event
  getEvent: (id) => api.get(`/events/${id}`),
  
  // Create new event
  createEvent: (eventData) => api.post('/events', eventData),
  
  // Update event
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  
  // Delete event
  deleteEvent: (id) => api.delete(`/events/${id}`),
  
  // Get event seats
  getSeats: (id) => api.get(`/events/${id}/seats`),
  
  // Reserve a seat
  reserveSeat: (id, seatData) => api.post(`/events/${id}/reserve-seat`, seatData),
  
  // Cancel seat reservation
  cancelSeat: (id, seatData) => api.post(`/events/${id}/cancel-seat`, seatData),
  
  // Generate QR code
  generateQRCode: (id) => api.post(`/events/${id}/generate-qr`),
  
  // Get user's booked events
  getUserBookings: () => api.get('/events/user/bookings'),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
};

export const ticketAPI = {
  getMyTickets: () => api.get('/tickets/my-tickets'),
  book: (bookingData) => api.post('/tickets/book', bookingData),
  cancel: (ticketId) => api.delete(`/tickets/${ticketId}`),
  getTicket: (ticketId) => api.get(`/tickets/${ticketId}`),
  downloadTicket: (ticketId) => api.get(`/tickets/${ticketId}/download`, {
    responseType: 'blob' // For file downloads
  }),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getEventAnalytics: (eventId) => api.get(`/analytics/events/${eventId}`),
  getRevenueReport: (params = {}) => api.get('/analytics/revenue', { params }),
};

export const userAPI = {
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  getUser: (userId) => api.get(`/admin/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

export const paymentAPI = {
  createPayment: (paymentData) => api.post('/payments/create', paymentData),
  confirmPayment: (paymentId) => api.post(`/payments/${paymentId}/confirm`),
  getPayment: (paymentId) => api.get(`/payments/${paymentId}`),
};

// Utility function for handling API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
    const status = error.response.status;
    
    switch (status) {
      case 400:
        return { message: `Bad Request: ${message}`, status };
      case 401:
        return { message: 'Unauthorized. Please login again.', status };
      case 403:
        return { message: 'Access denied. You do not have permission.', status };
      case 404:
        return { message: 'Resource not found.', status };
      case 409:
        return { message: `Conflict: ${message}`, status };
      case 500:
        return { message: 'Server error. Please try again later.', status };
      default:
        return { message: `Error: ${message}`, status };
    }
  } else if (error.request) {
    // Request was made but no response received
    return { message: 'Network error. Please check your connection.', status: 0 };
  } else {
    // Something else happened
    return { message: error.message || 'An unexpected error occurred', status: 0 };
  }
};

// Utility function for making API calls with error handling
export const apiCall = async (apiFunction, ...args) => {
  try {
    const response = await apiFunction(...args);
    return { data: response.data, error: null };
  } catch (error) {
    const errorInfo = handleApiError(error);
    console.error('API Error:', errorInfo);
    return { data: null, error: errorInfo };
  }
};

export default api;