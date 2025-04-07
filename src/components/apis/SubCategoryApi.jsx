import { API_URL, TOKEN } from './MainApi'; // Import the API base URL
import axios from 'axios';


// Function to get all roles
export const getSubCategoryApi = async () => {
    try {
        const response = await axios.get(`${API_URL}sub-category`, {
            'Authorization': TOKEN,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching sub-category:', error.response || error.message);
        throw error;
    }
};
// Function to create a new user
export const createSubCategoryApi = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}sub-category`, userData, {
            headers: {
                'Authorization': TOKEN,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating sub-category:', error);
        throw error;
    }
};
export const updateSubCategoryApi = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}sub-category/${id}`, formData, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating sub-category with ID ${id}:`, error);
        throw error;
    }
};
// Function to get all roles
export const viewSubCategoryApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}sub-category/${id}`, {
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

export const deleteSubCategoryApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}sub-category/${id}`, {
            headers: {
                'Authorization': TOKEN,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting sub-category:", error.response?.data || error.message);
        throw error;
    }
};