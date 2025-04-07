import { API_URL } from "./MainApi";

// Function to get all roles
export const getActionApi = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}action`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching actions:', error);
        throw error;
    }
};