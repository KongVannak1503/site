import { API_URL, TOKEN } from './MainApi'; // Import the API base URL
import axios from 'axios';


// Function to get all roles
export const getSkillApi = async () => {
    try {
        const response = await axios.get(`${API_URL}skills`, {
            'Authorization': TOKEN,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error.response || error.message);
        throw error;
    }
};
// Function to create a new user
export const createSkillApi = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}skills`, userData, {
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
export const updateSkillApi = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}skills/${id}`, formData, {
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
export const viewSkillApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}skills/${id}`, {
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

export const deleteSkillApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}skills/${id}`, {
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