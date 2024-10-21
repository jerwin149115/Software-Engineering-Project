const API_URL = 'http://10.0.10.125:5000/api/team'

export const login = async(userData) => {
    try {
        const response = await fetch(`${API_URL}/teamLogin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occurred');
        }

        const data = await response.json();

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};


export const logout = async () => {
    try {
        const response = await fetch(`${API_URL}/teamLogout`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred');
        }

        localStorage.removeItem('token');

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};
