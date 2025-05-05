import { API_URL, TOKEN } from './MainApi'; // Import the API base URL
import axios from 'axios';

export const getInterviewScheduleApi = async () => {
    try {
        const response = await axios.get(`${API_URL}interview-schedule`, {
            'Authorization': TOKEN,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error.response || error.message);
        throw error;
    }
};
// Function to create a new user
export const createInterviewScheduleApi = async (userData) => {
    try {
        console.log(userData)
        const response = await axios.post(`${API_URL}interview-schedule`, userData, {
            headers: {
                'Authorization': TOKEN,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating :', error);
        throw error;
    }
};
export const updateInterviewScheduleApi = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}interview-schedule/${id}`, formData, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating with ID ${id}:`, error);
        throw error;
    }
};
export const updateJobStatusApi = async (id, status) => {
    try {
        const response = await axios.put(`${API_URL}interview-schedule/status/${id}`, { status }, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error update with ID ${id}:`, error);
        throw error;
    }
};
// Function to get all roles
export const viewInterviewScheduleApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}interview-schedule/${id}`, {
            headers: {
                'Authorization': TOKEN,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching :', error.response?.data || error.message);
        throw error;
    }
};

export const viewInterviewScheduleUpdateApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}interview-schedule/view/${id}`, {
            headers: {
                'Authorization': TOKEN,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching :', error.response?.data || error.message);
        throw error;
    }
};

export const deleteInterviewScheduleApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}interview-schedule/${id}`, {
            headers: {
                'Authorization': TOKEN,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting:", error.response?.data || error.message);
        throw error;
    }
};