const API_BASE_URL = 'http://localhost:3000/api';

// Authentication APIs
const auth = {
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  async getProfile() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
};

// Rescue Operations APIs
const rescue = {
  async createRequest(requestData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/rescue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestData)
    });
    return response.json();
  },

  async updateStatus(reportId, statusData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/rescue/${reportId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(statusData)
    });
    return response.json();
  },

  async getDetails(reportId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/rescue/${reportId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
};

export const api = {
  auth,
  rescue
};