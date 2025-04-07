import { API_URL, TOKEN } from './MainApi'; // Import the API base URL and TOKEN
import axios from 'axios';

// Get the token from localStorage and set the Authorization headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Function to create a new role
export const createRoleApi = async (setData) => {
    try {
        const response = await axios.post(`${API_URL}roles`, setData, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Error creating role:', error.response?.data || error.message);
        throw error;
    }
};

// Function to get a role by ID
export const getRoleByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}roles/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching role with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

// Function to get all roles
export const getRoleApi = async () => {
    try {
        const response = await axios.get(`${API_URL}roles`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error.response?.data || error.message);
        throw error;
    }
};

// Function to update a role
export const updateRoleApi = async (formattedValues) => {
    try {
        const response = await axios.put(`${API_URL}roles/${formattedValues.id}`, formattedValues, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Error updating role:', error.response?.data || error.message);
        throw error;
    }
};

// Function to delete a role
export const deleteRoleApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}roles/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting role:", error.response?.data || error.message);
        throw error;
    }
};

// Function to check if a role name exists
export const checkRoleNameExistsApi = async (roleName) => {
    try {
        const response = await axios.get(`${API_URL}roles/check/${roleName}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Error checking role name:', error.response?.data || error.message);
        throw error;
    }
};
