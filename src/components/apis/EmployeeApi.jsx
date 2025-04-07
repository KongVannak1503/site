// src/api/user-api.jsx
import { API_URL, TOKEN } from './MainApi'; // Import the API base URL
import axios from 'axios';


// Function to create a new user
export const createEmployeeApi = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}employees`, userData, {
            headers: {
                'Authorization': TOKEN,
                'Content-Type': 'multipart/form-data', // Set to multipart/form-data for file uploads
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};

// Function to get all users
export const getEmployeeApi = async () => {
    try {
        const response = await axios.get(`${API_URL}employees`, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
};
export const viewEmployeeByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}employees/view/${id}`, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error;
    }
};

// // Function to get a user by ID
export const getEmployeeByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}employees/${id}`, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error;
    }
};


// // Function to update a user
export const updateEmployeeApi = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}employees/${id}`, formData, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating employee with ID ${id}:`, error);
        throw error;
    }
};

// Function to delete a user
export const deleteEmployeeApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}employees/${id}`, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting employee with ID ${id}:`, error);
        throw error;
    }
};

// Function to check if a role name exists
export const checkIdExistsApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}employees/check/${id}`, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error checking employee id:', error.response?.data || error.message);
        throw error;
    }
};
// Function to check if a role name exists
export const checkEmailExistsApi = async (email) => {
    try {
        const response = await axios.get(`${API_URL}employees/check/${email}`, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error checking employee email:', error.response?.data || error.message);
        throw error;
    }
};