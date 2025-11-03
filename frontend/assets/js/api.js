// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Authentication APIs
export const auth = {
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },

    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        return handleResponse(response);
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

// User APIs
export const user = {
    getProfile: async () => {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    updateProfile: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },
};

// Report APIs
export const reports = {
    create: async (reportData) => {
        const formData = new FormData();
        Object.keys(reportData).forEach(key => {
            if (key === 'images') {
                reportData[key].forEach(image => {
                    formData.append('images', image);
                });
            } else {
                formData.append(key, reportData[key]);
            }
        });

        const response = await fetch(`${API_BASE_URL}/reports`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData,
        });
        return handleResponse(response);
    },

    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/reports?${queryString}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    update: async (id, data) => {
        const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
            method: 'PUT',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },
};

// Team APIs
export const teams = {
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/rescue/teams?${queryString}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/rescue/teams/${id}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },
};

// Helper functions
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
    };
};

const handleResponse = async (response) => {
    const data = await response.json();
    
    if (!response.ok) {
        const error = data.error || data.message || 'Có lỗi xảy ra';
        throw new Error(error);
    }
    
    return data;
};
