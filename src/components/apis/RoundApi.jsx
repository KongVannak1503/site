import { API_URL, TOKEN } from './MainApi'; // Import the API base URL
import axios from 'axios';


// Function to get all roles
export const getRoundApi = async () => {
    try {
        const response = await axios.get(`${API_URL}round`, {
            'Authorization': TOKEN,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error.response || error.message);
        throw error;
    }
};
// Function to create a new user
export const createRoundApi = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}round`, userData, {
            headers: {
                'Authorization': TOKEN,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating round:', error);
        throw error;
    }
};
export const updateRoundApi = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}round/${id}`, formData, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating round with ID ${id}:`, error);
        throw error;
    }
};
// Function to get all roles
export const viewRoundApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}round/${id}`, {
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

export const deleteRoundApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}round/${id}`, {
            headers: {
                'Authorization': TOKEN,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting round:", error.response?.data || error.message);
        throw error;
    }
};