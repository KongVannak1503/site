import { API_URL, TOKEN } from './MainApi'; // Import the API base URL
import axios from 'axios';


// Function to get all roles
export const getDepartmentApi = async () => {
    try {
        const response = await axios.get(`${API_URL}departments`, {
            'Authorization': TOKEN,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error.response || error.message);
        throw error;
    }
};
// Function to create a new user
export const createDepartmentApi = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}departments`, userData, {
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
export const updateDepartmentApi = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}departments/${id}`, formData, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating Department with ID ${id}:`, error);
        throw error;
    }
};
// Function to get all roles
export const viewDepartmentApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}departments/${id}`, {
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

export const deleteDepartmentApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}departments/${id}`, {
            headers: {
                'Authorization': TOKEN,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting department:", error.response?.data || error.message);
        throw error;
    }
};