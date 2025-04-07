import { API_URL, TOKEN } from './MainApi'; // Import the API base URL
import axios from 'axios';


// Function to get all roles
export const getDesignationApi = async () => {
    try {
        const response = await axios.get(`${API_URL}designations`, {
            'Authorization': TOKEN,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error.response || error.message);
        throw error;
    }
};
// Function to create a new user
export const createDesignationApi = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}designations`, userData, {
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
export const updateDesignationApi = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}designations/${id}`, formData, {
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
export const viewDesignationApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}designations/${id}`, {
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

export const deleteDesignationApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}designations/${id}`, {
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
export const updateDesignStatusApi = async (id, isActive) => {
    try {
        const response = await axios.put(`${API_URL}designations/status/${id}`, { isActive }, {
            headers: {
                'Authorization': TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating job application with ID ${id}:`, error);
        throw error;
    }
};


export const updateDesignStatusesApi = async (ids, isActive) => {
    try {
        if (!Array.isArray(ids) || ids.length === 0 || typeof isActive !== 'boolean') {
            console.error("Invalid input data", { ids, isActive });
            throw new Error("Invalid request data: IDs should be an array and isActive should be a boolean.");
        }

        const token = localStorage.getItem('authToken'); // Assuming you're storing the token

        // Log the request data
        console.log("Sending request with data:", { ids, isActive });

        const response = await axios.put(
            `${API_URL}designations/statuses/${isActive}`,
            { ids, isActive },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log("Server response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating designations:", error);

        // Check if the error has a response object
        if (error.response) {
            // Log the error response data
            console.error("Error Response Data:", error.response.data);
            throw new Error(error.response.data.message || "An error occurred while updating designations.");
        } else {
            console.error("Error with the request:", error.message);
            throw new Error("Network error. Please try again.");
        }
    }
};

