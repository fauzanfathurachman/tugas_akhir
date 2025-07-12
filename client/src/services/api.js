import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Registration API
export const registrationAPI = {
  // Create new registration
  createPersonalData: (data) => api.post('/api/registration/personal-data', data),
  
  // Update parent data
  updateParentData: (registrationNumber, data) => 
    api.put(`/api/registration/${registrationNumber}/parent-data`, data),
  
  // Update academic data
  updateAcademicData: (registrationNumber, data) => 
    api.put(`/api/registration/${registrationNumber}/academic-data`, data),
  
  // Upload documents
  uploadDocuments: (registrationNumber, formData) => 
    api.post(`/api/registration/${registrationNumber}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Submit registration
  submitRegistration: (registrationNumber) => 
    api.post(`/api/registration/${registrationNumber}/submit`),
  
  // Get registration by number
  getRegistration: (registrationNumber) => 
    api.get(`/api/registration/${registrationNumber}`),
  
  // Update registration
  updateRegistration: (registrationNumber, data) => 
    api.put(`/api/registration/${registrationNumber}`, data),
};

// Admin API
export const adminAPI = {
  // Get all registrations
  getRegistrations: (params = {}) => 
    api.get('/api/admin/registrations', { params }),
  
  // Get registration by ID
  getRegistrationById: (id) => 
    api.get(`/api/admin/registrations/${id}`),
  
  // Update registration status
  updateStatus: (id, status, notes) => 
    api.put(`/api/admin/registrations/${id}/status`, { status, notes }),
  
  // Get dashboard statistics
  getDashboardStats: () => 
    api.get('/api/admin/dashboard'),
  
  // Export registrations
  exportRegistrations: (params = {}) => 
    api.get('/api/admin/export/registrations', { 
      params,
      responseType: 'blob'
    }),
  
  // Send reminders
  sendReminders: () => 
    api.post('/api/admin/send-reminders'),
  
  // Get admin list
  getAdmins: () => 
    api.get('/api/admin/admins'),
  
  // Create new admin
  createAdmin: (data) => 
    api.post('/api/admin/admins', data),
};

// Notification API
export const notificationAPI = {
  // Test email
  testEmail: (email, registrationNumber) => 
    api.post('/api/notifications/test-email', { email, registrationNumber }),
  
  // Test SMS
  testSMS: (phoneNumber, registrationNumber) => 
    api.post('/api/notifications/test-sms', { phoneNumber, registrationNumber }),
  
  // Resend confirmation
  resendConfirmation: (registrationNumber) => 
    api.post(`/api/notifications/resend-confirmation/${registrationNumber}`),
  
  // Get notification settings
  getSettings: () => 
    api.get('/api/notifications/settings'),
};

// Health check
export const healthCheck = () => api.get('/api/health');

export default api; 