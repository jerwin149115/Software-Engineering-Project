const API_URL = 'http://192.168.103.183:5000/api/products';

export const getProduct = async (name = '') => {
    const response = await fetch(`${API_URL}/getProduct?name=${name}`, {
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