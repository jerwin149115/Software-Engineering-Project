const API_URL = `http://10.0.10.125:5000/api/products`

export const productProfile = async(id) => {
    const response = await fetch(`${API_URL}/getProductById/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch the products');
    }

    return await response.json();
}