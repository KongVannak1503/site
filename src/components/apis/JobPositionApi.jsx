import { API_URL, TOKEN } from './MainApi'; // Import the API base URL
import axios from 'axios';


// Function to get all roles
export const getJobPositionApi = async () => {
    try {
        const response = await axios.get(`${API_URL}job-positions`, {
            'Authorization': TOKEN,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error.response || error.message);
        throw error;
    }
};
// Function to create a new user
export const createJobPositionApi = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}job-positions`, userData, {
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
export const updateJobPositionApi = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}job-positions/${id}`, formData, {
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
// Function to get all roles
export const viewJobPositionApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}job-positions/${id}`, {
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

export const deleteJobPositionApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}job-positions/${id}`, {
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

export const updateJobPositionStatusApi = async (id, isActive) => {
    try {
        const response = await axios.put(`${API_URL}job-positions/status/${id}`, { isActive }, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating job position with ID ${id}:`, error);
        throw error;
    }
};