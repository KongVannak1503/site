import { API_URL, TOKEN } from './MainApi'; // Import the API base URL
import axios from 'axios';


// Function to get all roles
export const getCategoryApi = async () => {
    try {
        const response = await axios.get(`${API_URL}category`, {
            'Authorization': TOKEN,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error.response || error.message);
        throw error;
    }
};
// Function to create a new user
export const createCategoryApi = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}category`, userData, {
            headers: {
                'Authorization': TOKEN,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};
export const updateCategoryApi = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}category/${id}`, formData, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating designation with ID ${id}:`, error);
        throw error;
    }
};
// Function to get all roles
export const viewCategoryApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}category/${id}`, {
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

export const deleteCategoryApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}category/${id}`, {
            headers: {
                'Authorization': TOKEN,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting designation:", error.response?.data || error.message);
        throw error;
    }
};