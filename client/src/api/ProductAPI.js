const API_URL = 'http://10.0.10.125:5000/api/products';

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

export const addProduct = async (product) => {
    try {
        const response = await fetch(`${API_URL}/addProduct`, {
            method: 'POST',
            body: product,
        });

        if (!response.ok) {
            throw new Error('Failed to add product');
        }

        const newProduct = await response.json();
        return newProduct;
    } catch (error) {
        console.error('Error in addProduct:', error);
        throw error;
    }
};

export const updateProduct = async (id, product) => {
    const response = await fetch(`${API_URL}/updateProduct/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        throw new Error('Failed to update product');
    }

    return await response.json();
};

export const addQuantity = async (id, product) => {
    const response = await fetch(`${API_URL}/addQuantity/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        throw new Error('Failed to update the Quantity');
    }

    return await response.json();
}

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_URL}/deleteProduct/${id}`, {
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
