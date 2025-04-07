// src/api/user-api.jsx
import { API_URL, TOKEN } from './MainApi'; // Import the API base URL
import axios from 'axios';


// Function to create a new user
export const createProjectApi = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}projects`, userData, {
            headers: {
                'Authorization': TOKEN,
                'Content-Type': 'multipart/form-data', // Set to multipart/form-data for file uploads
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
};

// Function to get all users
export const getProjectApi = async () => {
    try {
        const response = await axios.get(`${API_URL}projects`, {
            headers: {
                'Authorization': TOKEN,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
    }
};
export const viewEmployeeByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}projects/view/${id}`, {
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
export const getProjectByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}projects/${id}`, {
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
export const updateProjectApi = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}projects/${id}`, formData, {
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
export const deleteProjectApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}projects/${id}`, {
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
