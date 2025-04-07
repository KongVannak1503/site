import { API_URL, TOKEN } from './MainApi'; // Import the API base URL
import axios from 'axios';


// Function to get all roles
export const getJobApplicationApi = async () => {
    try {
        const response = await axios.get(`${API_URL}job-application`, {
            'Authorization': TOKEN,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error.response || error.message);
        throw error;
    }
};
// Function to create a new user
export const createJobApplicationApi = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}job-application`, userData, {
            headers: {
                'Authorization': TOKEN,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating skill:', error);
        throw error;
    }
};
export const updateJobApplicationApi = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}job-application/${id}`, formData, {
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
export const updateJobApplicationStatusApi = async (id, status) => {
    try {
        const response = await axios.put(`${API_URL}job-application/status/${id}`, { status }, {
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
export const viewJobApplicationApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}job-application/${id}`, {
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

export const deleteJobApplicationApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}job-application/${id}`, {
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