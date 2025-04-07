// src/api/user-api.jsx
import { API_URL, TOKEN } from './MainApi'; // Import the API base URL
import axios from 'axios';


// Function to create a new user
export const createQueryApi = async (userData) => {
    try {
        console.log('Authorization Token:', TOKEN); // Log the token
        const response = await axios.post(`${API_URL}users`, userData, {
            headers: {
                'Authorization': TOKEN,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};


// Function to get all users
export const getQueryApi = async () => {
    try {
        const response = await axios.get(`${API_URL}users`, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Update other functions similarly...


// Function to get a user by ID
export const getQueryByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}users/${id}`, {
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

// Function to update a user
export const updateQueryApi = async (userId, formData) => {
    try {
        const response = await axios.put(`${API_URL}users/${userId}`, formData, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating user with ID ${userId}:`, error);
        throw error;
    }
};

// Function to delete a user
export const deleteQueryApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}users/${id}`, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw error;
    }
};
// Function to check if a role name exists
export const checkUsernameExistsApi = async (username) => {
    try {
        const response = await axios.get(`${API_URL}users/check/${username}`, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error checking employee username:', error.response?.data || error.message);
        throw error;
    }
};