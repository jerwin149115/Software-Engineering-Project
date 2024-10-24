const API_URL = 'http://192.168.103.183:5000/api/team'

export const register = async(userData) => {
    try {
        const response = await fetch(`${API_URL}/teamRegister`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occured');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};


export const fetchNames = async (username = '') => {
    const response = await fetch(`${API_URL}/fetchNames?username=${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }

    return await response.json();
};

export const updateTeam = async (id, userData) => {
    const response = await fetch(`${API_URL}/updateTeam/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('Failed to update product');
    }

    return await response.json();
};

export const deleteTeam = async (id) => {
    const response = await fetch(`${API_URL}/deleteTeam/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete product');
    }

    return await response.json();
};