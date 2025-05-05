import { API_URL, TOKEN } from './MainApi'; // Import the API base URL
import axios from 'axios';


// Function to get all roles
export const getJobApi = async () => {
    try {
        const response = await axios.get(`${API_URL}jobs`, {
            'Authorization': TOKEN,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error.response || error.message);
        throw error;
    }
};
// Function to create a new user
export const createJobApi = async (userData) => {
    try {
        console.log(userData)
        const response = await axios.post(`${API_URL}jobs`, userData, {
            headers: {
                'Authorization': TOKEN,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating job:', error);
        throw error;
    }
};
export const updateJobApi = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}jobs/${id}`, formData, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating skill with ID ${id}:`, error);
        throw error;
    }
};
export const updateJobStatusApi = async (id, status) => {
    try {
        const response = await axios.put(`${API_URL}jobs/status/${id}`, { status }, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating job application with ID ${id}:`, error);
        throw error;
    }
};
// Function to get all roles
export const viewJobApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}jobs/${id}`, {
            headers: {
                'Authorization': TOKEN,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error.response?.data || error.message);
        throw error;
    }
};

export const viewJobUpdateApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}jobs/view/${id}`, {
            headers: {
                'Authorization': TOKEN,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error.response?.data || error.message);
        throw error;
    }
};

export const deleteJobApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}jobs/${id}`, {
            headers: {
                'Authorization': TOKEN,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting skill:", error.response?.data || error.message);
        throw error;
    }
};